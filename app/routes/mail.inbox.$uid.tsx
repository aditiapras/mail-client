import { Button } from "~/components/ui/button";
import { ArrowLeft, Forward, Reply, Star, Trash } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Link, useParams } from "@remix-run/react";
import { useEmail } from "~/lib/useEmail";
import moment from "moment-timezone";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Inbox | Mail" },
    { name: "description", content: "View email details" },
  ];
};

export default function Page() {
  const params = useParams();
  const { data: email, isLoading, error } = useEmail(params.uid);

  // Get the sender's name or email address
  const getSenderName = () => {
    if (!email?.from) return "Unknown Sender";

    // Handle different from structures
    if (Array.isArray(email.from)) {
      return email.from[0]?.name || email.from[0]?.address || "Unknown";
    } else if (typeof email.from === "object") {
      return email.from.name || email.from.address || "Unknown";
    }

    return String(email.from);
  };

  // Get the first letter of the sender's name for the avatar fallback
  const getAvatarFallback = () => {
    const name = getSenderName();
    return name.substring(0, 1).toUpperCase();
  };

  // Define an interface for email address objects
  interface EmailAddressObject {
    name?: string;
    address?: string;
    text?: string;
  }

  // Format email addresses for display
  const formatEmailAddresses = (
    addresses:
      | string
      | EmailAddressObject
      | EmailAddressObject[]
      | null
      | undefined
  ) => {
    if (!addresses) return "";

    if (Array.isArray(addresses)) {
      return addresses.map((addr) => addr.address || addr.name).join(", ");
    } else if (typeof addresses === "object") {
      return addresses.address || addresses.name || String(addresses);
    }

    return String(addresses);
  };

  return (
    <div className="col-span-5 flex flex-col pl-4">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-sm text-muted-foreground">
            Loading...
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-sm text-red-500">
            Error: {error.message}
          </p>
        </div>
      )}

      {email && (
        <>
          <div className="flex gap-1 items-center">
            <Link to="/mail/inbox">
              <Button size="sm" variant="ghost">
                <ArrowLeft /> Back
              </Button>
            </Link>
            <Button size="sm" variant="ghost">
              <Reply /> Reply
            </Button>
            <Button size="sm" variant="ghost">
              <Forward /> Forward
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={email.status?.flagged ? "text-yellow-500" : ""}
            >
              <Star /> Favorite
            </Button>
            <Button size="sm" variant="ghost">
              <Trash /> Delete
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <p className="font-medium line-clamp-1">{email.subject}</p>
            <div className="flex gap-4">
              <Avatar className="size-10">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${getSenderName()}&background=random`}
                />
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-medium line-clamp-1">
                  {getSenderName()} -{" "}
                  <span className="text-xs text-muted-foreground">
                    {moment(email.date).format("MMM D, YYYY h:mm A")}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  from: {formatEmailAddresses(email.from)}
                </p>
                <div className="flex gap-4">
                  <p className="text-xs text-muted-foreground">
                    to: {formatEmailAddresses(email.to)}
                  </p>
                  {email.cc && (
                    <p className="text-xs text-muted-foreground">
                      cc: {formatEmailAddresses(email.cc)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            <div className="text-sm">
              {email.html ? (
                <div dangerouslySetInnerHTML={{ __html: email.html }} />
              ) : (
                <p style={{ whiteSpace: "pre-wrap" }}>{email.text}</p>
              )}
            </div>
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">
                  Attachments ({email.attachments.length})
                </p>
                {email.attachments.map(
                  (att, index) =>
                    att.contentType.includes("image") && (
                      <div key={index}>
                        <img
                          src={`data:${att.contentType};base64,${att.content}`}
                          alt={att.filename}
                          className="max-w-[200px] max-h-[200px] object-contain"
                        />
                      </div>
                    )
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {email.attachments.map(
                    (
                      attachment: {
                        filename: string;
                        size: number;
                        contentType: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border rounded p-2 flex items-center gap-2"
                      >
                        <p className="text-xs">{attachment.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          ({Math.round(attachment.size / 1024)} KB)
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
