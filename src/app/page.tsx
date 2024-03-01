import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button2";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="ThoughtThesis" height={100} width={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-6xl">
          ThoughtThesis
        </span>
      </div>
      <p className="max-w-prose text-center">
        An Intelligent note-taking app with AI integration, build with OpenAI,
        Pinecone, Next.js, Shadcn UI, Acentrinity UI, clerk, and more.
      </p>
      <Button
        size="lg"
        className="relative inline-flex h-10 w-20 overflow-hidden p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-sm bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          <Link href="/notes">Open</Link>
        </span>
      </Button>
    </main>
  );
}
