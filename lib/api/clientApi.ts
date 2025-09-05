"use client";

import { Note } from "@/types/note";
import { User } from "@/types/user";
import { RegisterRequest, LoginRequest } from "@/types/auth";
import { nextServer } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function registerClient(data: RegisterRequest): Promise<User> {
  const { data: res } = await nextServer.post<User>("/auth/register", data);
  return res;
}

export async function loginClient(data: LoginRequest): Promise<User> {
  const { data: res } = await nextServer.post<User>("/auth/login", data);
  return res;
}

export async function fetchNotesClient(
  search = "",
  page = 1,
  perPage = 9,
  tag?: string
) {
  const params: Record<string, string> = {
    page: String(page),
    perPage: String(perPage),
  };
  if (search) params.search = search;
  if (tag && tag.toLowerCase() !== "all") params.tag = tag;

  const { data } = await nextServer.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    { params }
  );
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  const { data } = await nextServer.post<Note>("/notes", note);
  return data;
}

export async function deleteNoteClient(id: string): Promise<Note> {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
}

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];
export async function getTagsClient(): Promise<string[]> {
  try {
    const { notes } = await fetchNotesClient("");
    const tagsFromNotes: string[] = Array.from(
      new Set(notes.map((note) => note.tag))
    );
    return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
  } catch (err) {
    console.error("Cannot fetch tags:", err);
    return DEFAULT_TAGS;
  }
}
