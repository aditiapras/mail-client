import type { MetaFunction } from "@remix-run/node";
import EmailTable from "~/components/email-table";

export const meta: MetaFunction = () => {
  return [
    { title: "Inbox | Mail" },
    { name: "description", content: "Someproject.xyz Mail Client" },
  ];
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <EmailTable />
    </div>
  );
}
