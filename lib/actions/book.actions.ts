import { CreateBook } from "@/types";

type BookLookupResult = {
  exists: boolean;
  book?: {
    slug: string;
  };
};

type CreateBookResult = {
  success: boolean;
  error?: string;
  isBillingError?: boolean;
  alreadyExists?: boolean;
  data: {
    _id: string;
    slug: string;
  };
};

type SaveSegmentsResult = {
  success: boolean;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "")
    .replaceAll(/-+/g, "-");
}

export async function checkBookExists(title: string): Promise<BookLookupResult> {
  void title;
  return { exists: false };
}

export async function createBook(payload: CreateBook): Promise<CreateBookResult> {
  return {
    success: true,
    data: {
      _id: crypto.randomUUID(),
      slug: slugify(payload.title),
    },
  };
}

export async function saveBookSegments(
  bookId: string,
  clerkId: string,
  segments: string[],
): Promise<SaveSegmentsResult> {
  void bookId;
  void clerkId;
  void segments;
  return { success: true };
}
