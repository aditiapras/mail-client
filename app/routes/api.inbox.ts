import { json } from "@remix-run/node";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

const streamToBuffer = async (
  stream: NodeJS.ReadableStream
): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
};

export async function loader() {
  const client = new ImapFlow({
    host: process.env.STARWALT_HOST!,
    port: 993,
    secure: true,
    auth: {
      user: process.env.STARWALT_EMAIL!,
      pass: process.env.STARWALT_PASSWORD!,
    },
    logger: false,
  });

  await client.connect();
  await client.mailboxOpen("INBOX");

  const emails = [];

  for await (const message of client.fetch("1:*", {
    envelope: true,
    source: true,
    flags: true,
  })) {
    const sourceBuffer =
      message.source instanceof Buffer
        ? message.source
        : message.source
        ? await streamToBuffer(message.source)
        : Buffer.from("");

    const parsed = await simpleParser(sourceBuffer);

    emails.push({
      uid: message.uid,
      subject: parsed.subject || "(No subject)",
      from: parsed.from?.value || "",
      to: parsed.to?.value || "",
      date: parsed.date || new Date(),
      text: parsed.text || "",
      html: parsed.html || "",
      status: {
        seen: message.flags?.has("\\Seen") || false,
        flagged: message.flags?.has("\\Flagged") || false,
        answered: message.flags?.has("\\Answered") || false,
        deleted: message.flags?.has("\\Deleted") || false,
        draft: message.flags?.has("\\Draft") || false,
        recent: message.flags?.has("\\Recent") || false,
        important: message.flags?.has("\\Important") || false,
      },
      attachments:
        parsed.attachments?.map((att) => ({
          filename: att.filename || "untitled",
          contentType: att.contentType,
          size: att.size,
          content: att.content.toString("base64"),
        })) || [],
    });
  }

  await client.logout();

  return json(emails);
}
