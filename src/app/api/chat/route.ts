import { notesIndex } from "@/lib/db/pinecone";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    // storing the messages in body variable
    const body = await req.json();

    // ChatCompletionMessage is the type from openAI
    const messages: ChatCompletionMessage[] = body.messages;

    // sending last 6 messages
    const messageTruncated = messages.slice(-6);

    // making these messages into vector embedding to search relevant nodes
    // that fits the current chat history and query of the user.
    const embedding = await getEmbedding(
      // since it is an array we making it into single string
      messageTruncated.map((message) => message.content).join("/n"),
    );

    const { userId } = auth();

    // request a query for vector to pinecone
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma?.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found: ", relevantNotes);

    // instructing the ai:
    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "you re an intelligent note-taking app. you answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes
          ?.map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    // request to chat gpt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messageTruncated],
    });

    // returning the response to frontend
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
