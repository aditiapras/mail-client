import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { Pen, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

export const meta: MetaFunction = () => {
  return [
    { title: "Inbox | Mail" },
    { name: "description", content: "Someproject.xyz Mail Client" },
  ];
};

export default function Page() {
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
          <ScrollArea className="">
            <Link
              to="/mail/inbox/1"
              className="hover:bg-neutral-100 p-2 flex flex-col gap-2 border-b"
            >
              <div className="flex justify-between items-center">
                <p>Name</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
              <p className="text-sm">Subject</p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum sed
                alias autem! Eum amet, saepe maiores at aliquam rerum reiciendis
                asperiores ipsam eveniet velit corrupti distinctio culpa
                consequatur ab, quia odit modi blanditiis? Cumque unde, natus
                officiis accusamus, facilis eos harum libero obcaecati vel et,
                cupiditate alias sed a saepe.
              </p>
            </Link>
          </ScrollArea>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
