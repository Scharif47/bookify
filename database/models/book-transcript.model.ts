import { model, Schema, models } from "mongoose";
import { IBookTranscript } from "@/types";

const BookTranscriptSchema = new Schema<IBookTranscript>(
  {
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

BookTranscriptSchema.index({ clerkId: 1, bookId: 1 }, { unique: true });

const BookTranscript = models.BookTranscript || model<IBookTranscript>("BookTranscript", BookTranscriptSchema);

export default BookTranscript;
