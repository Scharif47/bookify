import { searchBookSegments } from "@/lib/actions/book.actions";
import { NextResponse } from "next/server";

interface VapiToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: {
      bookId: string;
      query: string;
    };
  };
}

interface VapiRequestBody {
  message: {
    toolCalls: VapiToolCall[];
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as VapiRequestBody;
  const toolCalls = body.message?.toolCalls ?? [];

  const results = await Promise.all(
    toolCalls.map(async (toolCall) => {
      if (toolCall.function.name !== "search-book") {
        return { toolCallId: toolCall.id, result: "Unknown tool" };
      }

      const { bookId, query } = toolCall.function.arguments;
      const searchResult = await searchBookSegments(bookId, query, 3);

      const result =
        searchResult.success && searchResult.data.length > 0
          ? searchResult.data.map((s) => (s as { content: string }).content).join("\n\n")
          : "No information found about this topic.";

      return { toolCallId: toolCall.id, result };
    }),
  );

  return NextResponse.json({ results });
}
