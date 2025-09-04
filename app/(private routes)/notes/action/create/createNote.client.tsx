"use client";

import NoteForm from "@/components/NoteForm/NoteForm";
import { getTagsClient } from "@/lib/api/clientApi";

import { useQuery } from "@tanstack/react-query";

export default function CreateNoteClient() {
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: getTagsClient,
  });

  return <NoteForm tags={tags} />;
}
