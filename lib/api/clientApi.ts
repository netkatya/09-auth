"use client";

import { Note } from "@/types/note";
import { User } from "@/types/user";
import { RegisterRequest, LoginRequest } from "@/types/auth";
import { nextServer } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];

export async function registerClient(data: RegisterRequest): Promise<User> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || `Registration failed: ${res.status}`);
  }

  return await res.json();
}

export async function loginClient(data: LoginRequest): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || `Login failed: ${res.status}`);
  }

  return await res.json();
}

export async function fetchNotesClient(
  search = "",
  page = 1,
  perPage = 12,
  tag?: string
): Promise<FetchNotesResponse> {
  try {
    const params: Record<string, string> = {
      page: String(page),
      perPage: String(perPage),
    };
    if (search) params.search = search;
    if (tag && tag.toLowerCase() !== "all") params.tag = tag;

    const res = await fetch(`/api/notes?${new URLSearchParams(params)}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    return (await res.json()) as FetchNotesResponse;
  } catch (err) {
    console.error("fetchNotesClient error:", err);
    return { notes: [], totalPages: 0 };
  }
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

export async function getTagsClient(): Promise<string[]> {
  try {
    const res = await fetchNotesClient();
    const tagsFromNotes: string[] = Array.from(
      new Set(res.notes.map((note) => note.tag))
    );
    return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
  } catch (err) {
    console.error("Cannot fetch tags:", err);
    return DEFAULT_TAGS;
  }
}

export async function getUserProfile(): Promise<User> {
  const res = await fetch("/api/users/me", { credentials: "include" });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function updateUser(
  update: Partial<{ username: string }>
): Promise<User> {
  try {
    const { data } = await nextServer.patch<User>("/users/me", update, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    console.error("updateUser error:", err);
    throw err;
  }
}
