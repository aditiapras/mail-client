import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Trash | Mail" },
    { name: "description", content: "Someproject.xyz Mail Client" },
  ];
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <p className="text-xl font-semibold">Trash</p>
    </div>
  );
}
