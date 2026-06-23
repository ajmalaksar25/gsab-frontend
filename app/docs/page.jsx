import { redirect } from "next/navigation";

export const metadata = {
  title: "GSAB Docs — usage & API",
  description:
    "How to use GSAB: install, authentication, schemas, async CRUD, querying, charts, encryption and the CLI.",
};

export default function DocsIndex() {
  redirect("/docs/introduction");
}
