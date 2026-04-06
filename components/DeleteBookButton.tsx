"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { deleteBook } from "@/lib/actions/book.actions";

const DeleteBookButton = ({ bookId }: { bookId: string }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this book? This cannot be undone.")) return;

    setDeleting(true);
    await deleteBook(bookId);
    setDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Delete book"
      className="absolute top-2 z-10 bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow transition-colors cursor-pointer"
      style={{ right: "calc(var(--spacing) * 5)" }}
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
};

export default DeleteBookButton;
