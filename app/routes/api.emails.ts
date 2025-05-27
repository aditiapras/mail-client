import { json } from "@remix-run/node";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

// Type definitions are handled inline with eslint-disable directives

// Define a type for the ImapFlow message
interface ImapMessage {
  uid: number;
  id?: string;
  messageId?: string;
  threadId?: string;
  date: Date;
  flags: string[];
  source: Buffer;
}

const mailClient = new ImapFlow({
  host: process.env.STARWALT_HOST,
  port: 993,
  secure: true,
  auth: {
    user: process.env.STARWALT_EMAIL,
    pass: process.env.STARWALT_PASSWORD,
  },
  logger: false,
});

export async function loader() {
  try {
    await mailClient.connect();
    await mailClient.mailboxOpen("INBOX");

    // Use fetchAll method with proper type casting
    // ImapFlow has this method but TypeScript definitions might be incomplete
    interface ImapFlowWithFetchAll extends ImapFlow {
      fetchAll(range: string, options: object): Promise<ImapMessage[]>;
    }

    const messages = await (mailClient as ImapFlowWithFetchAll).fetchAll(
      "1:*",
      {
        envelope: true,
        flags: true,
        source: true,
      }
    );

    const emails = await Promise.all(
      messages.map(async (msg: ImapMessage) => {
        const parsed = await simpleParser(msg.source);

        // Format email addresses correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatAddresses = (addresses: any) => {
          if (!addresses) return [];

          // Handle both single address and array of addresses
          const addressArray = Array.isArray(addresses.value)
            ? addresses.value
            : addresses.value
            ? [addresses.value]
            : [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return addressArray.map((addr: any) => ({
            name: addr.name || undefined,
            address: addr.address,
          }));
        };

        return {
          uid: msg.uid,
          id: msg.id,
          messageId: msg.messageId,
          threadId: msg.threadId,
          date: msg.date,
          subject: parsed.subject,
          from: formatAddresses(parsed.from),
          to: formatAddresses(parsed.to),
          cc: formatAddresses(parsed.cc),
          bcc: formatAddresses(parsed.bcc),
          text: parsed.text,
          html: parsed.html,
          flags: msg.flags,
          status: {
            seen: Array.isArray(msg.flags)
              ? msg.flags.includes("\\Seen")
              : false,
            flagged: Array.isArray(msg.flags)
              ? msg.flags.includes("\\Flagged")
              : false,
            answered: Array.isArray(msg.flags)
              ? msg.flags.includes("\\Answered")
              : false,
            deleted: Array.isArray(msg.flags)
              ? msg.flags.includes("\\Deleted")
              : false,
            draft: Array.isArray(msg.flags)
              ? msg.flags.includes("\\Draft")
              : false,
          },
          attachments: parsed.attachments.map((a) => ({
            filename: a.filename,
            contentType: a.contentType,
            size: a.size,
          })),
        };
      })
    );

    await mailClient.logout();
    return json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);

    // Make sure to close the connection even if there's an error
    try {
      await mailClient.logout();
      console.log("Disconnected from IMAP server after error");
    } catch (logoutError) {
      console.error("Error closing IMAP connection:", logoutError);
    }

    return json(
      {
        error: "Failed to fetch emails",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
