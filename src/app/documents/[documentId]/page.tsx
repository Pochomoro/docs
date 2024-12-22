import { Id } from "../../../../convex/_generated/dataModel";
import { Document } from "@/app/documents/[documentId]/document";

import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";

import { api } from "../../../../convex/_generated/api";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}
const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  const { getToken } = await auth();
  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    throw Error("Unauthorized");
  }

  console.log("Loading Document ... ");

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token },
  );

  if (!preloadedDocument) {
    throw Error("Document not found");
  }

  return <Document preloadedDocument={preloadedDocument} />;
};

export default DocumentIdPage;
