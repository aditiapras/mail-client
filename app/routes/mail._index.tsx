import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("/mail/inbox");
};

export default function Page() {
  return null;
}
