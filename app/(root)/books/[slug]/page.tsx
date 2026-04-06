import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import { IBook } from "@/types";

export default async function BookDetailsPage({ params }: { readonly params: Promise<{ slug: string }> }) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const result = await getBookBySlug(slug);
  if (!result.success || !result.data) redirect("/");

  const book = result.data as IBook;

  return (
    <div className="book-page-container relative min-h-screen flex flex-col items-center py-12">
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="size-5 sm:size-6 text-[#212a3b]" />
      </Link>

      <VapiControls book={book} />
      {/* Transcript is rendered inside VapiControls (client) to use live state from the hook */}
    </div>
  );
}
