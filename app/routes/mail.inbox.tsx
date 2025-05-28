import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { Paperclip, Pen, Search, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useInbox } from "~/lib/useInbox";
import moment from "moment-timezone";

export const meta: MetaFunction = () => {
  return [
    { title: "Inbox | Mail" },
    { name: "description", content: "Someproject.xyz Mail Client" },
  ];
};

export default function Page() {
  const { data, isLoading, error } = useInbox("/api/inbox");
  return (
    <div className="flex flex-1 flex-col gap-4 px-4">
      <div className="grid grid-cols-8">
        <div className="col-span-3 border-r flex flex-col pr-4 h-[calc(100vh-5rem)]">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Inbox</p>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Pen />
            </Button>
          </div>
          <div className="relative my-4">
            <Input
              type="text"
              placeholder="Search"
              className="w-full pl-8 rounded-full"
            />
            <Search className="absolute left-2 size-4 text-muted-foreground top-1/2 -translate-y-1/2" />
          </div>
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
          <ScrollArea className="">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.map?.((email: any) => (
              <Link
                key={email.uid}
                to={`/mail/inbox/${email.uid}`}
                className="hover:bg-neutral-100 p-2 flex flex-col gap-2 border-b"
              >
                <div className="flex justify-between items-center">
                  {email.attachments?.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Paperclip className="size-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {email.from?.[0]?.name || "Unknown Sender"}
                      </p>
                      {email.status?.flagged && (
                        <Star className="size-3 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {email.from?.[0]?.name || "Unknown Sender"}
                      </p>
                      {email.status?.flagged && (
                        <Star className="size-3 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {moment(email.date).fromNow()}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold line-clamp-1 ${
                    email.status?.seen ? "text-neutral-700" : "text-blue-500"
                  }`}
                >
                  {email.subject}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {email.text || "No content"}
                </p>
              </Link>
            ))}
            {data?.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-sm text-muted-foreground p-4">
                  No emails found
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
