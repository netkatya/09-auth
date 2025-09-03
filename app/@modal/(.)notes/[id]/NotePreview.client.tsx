"use client";

import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Loader from "@/app/loading";

type NotePreviewProps = {
  id: string;
};

const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const close = () => router.back();

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <button onClick={close} className={css.backBtn}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

const NotePreviewClient = ({ id }: NotePreviewProps) => {
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    placeholderData: (prev) => prev,
    refetchOnMount: false,
  });

  if (isLoading) return <Loader />;
  if (!note) return <p>Note not found</p>;

  return (
    <Modal>
      <div className={css.item}>
        <h2 className={`${css.header} ${css.h2}`}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <p className={css.date}>
          Updated: {new Date(note.updatedAt).toLocaleDateString()}
        </p>
        <p className={css.tag}>{note.tag}</p>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
