import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "404 | Not Found" },
    { name: "description", content: "Someproject.xyz Mail Client" },
  ];
};

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-4xl font-semibold">
        404 | Page you are looking for does not exist
      </p>
    </div>
  );
}
