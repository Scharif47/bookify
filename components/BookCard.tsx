import Link from "next/link";
import { BookCardProps } from "@/types";
import Image from "next/image";
import DeleteBookButton from "@/components/DeleteBookButton";

const BookCard = ({ title, author, coverURL, slug, bookId, canDelete, plain }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article className={`book-card ${plain ? "book-card-plain" : ""}`}>
        <figure className="book-card-figure">
          <div className="relative">
            {canDelete && bookId && <DeleteBookButton bookId={bookId} />}
            <div className={`book-card-cover-wrapper ${plain ? "bg-transparent! rounded-none!" : ""}`}>
              <Image src={coverURL} alt={title} width={133} height={200} className="book-card-cover" style={{ height: "auto" }} />
            </div>
          </div>

          <figcaption className="book-card-meta">
            <h3 className="book-card-title">{title}</h3>
            <p className="book-card-author">{author}</p>
          </figcaption>
        </figure>
      </article>
    </Link>
  );
};
export default BookCard;
