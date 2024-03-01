import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("PINECONE_API_KEY is not set");
}

console.log("API Key:", apiKey);

const pinecone = new Pinecone({
  apiKey,
});

export const notesIndex = pinecone.Index("nextjs-ai-note-app");
