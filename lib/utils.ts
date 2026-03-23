import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ParsedPdfResult = {
  content: string[];
  cover: string;
};

export async function parsePDFFile(file: File): Promise<ParsedPdfResult> {
  const cover = URL.createObjectURL(file);

  return {
    // Lightweight placeholder parser to keep the upload flow unblocked.
    content: [file.name],
    cover,
  };
}
