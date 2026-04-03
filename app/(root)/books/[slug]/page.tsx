import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import { IBook } from "@/types";



export default async function BookDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const result = await getBookBySlug(slug);
  if (!result.success || !result.data) redirect("/");

  const book = result.data as IBook;

  return (
    <div className="book-page-container relative min-h-screen flex flex-col items-center py-12">
      <Link href="/" className="back-btn-floating">
        <div className="w-12 h-12 bg-white rounded-full border shadow flex items-center justify-center">
          <ArrowLeft className="size-6 text-[#212a3b]" />
        </div>
      </Link>

      <VapiControls book={book} />
    </div>
  );
}
