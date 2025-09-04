import css from "./createNote.module.css";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import CreateNoteClient from "./createNote.client";
import { getTags } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Create note",
  description: "Page for creating a new note",
  openGraph: {
    title: "Create note",
    description: "Page for creating a new note",
    url: "https://08-zustand-ten-ochre.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Note Hub Logo",
      },
    ],
  },
};

export default async function CreateNote() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <HydrationBoundary state={dehydratedState}>
          <CreateNoteClient />
        </HydrationBoundary>
      </div>
    </main>
  );
}
