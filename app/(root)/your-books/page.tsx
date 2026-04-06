import BookCard from "@/components/BookCard";
import { getMyBooks } from "@/lib/actions/book.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const YourBooksPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const result = await getMyBooks();
  const books = result.data ?? [];

  return (
    <main className="wrapper container">
      <div className="pt-24 pb-8">
        <h1 className="font-serif text-3xl font-bold">My Books</h1>
        <p className="text-sm text-[#374151] mt-1">{books.length} {books.length === 1 ? "book" : "books"} uploaded</p>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-600">You haven't uploaded any books yet.</p>
          <a href="/books/new" className="mt-4 text-sm text-[#212a3b] underline hover:opacity-70">Upload your first book</a>
        </div>
      ) : (
        <div className="library-books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
              bookId={book._id}
              canDelete
              plain
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default YourBooksPage;
