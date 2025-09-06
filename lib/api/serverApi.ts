import { User } from "@/types/user";
import { Note } from "@/types/note";
import { RegisterRequest, LoginRequest } from "@/types/auth";
import { cookies } from "next/headers";
import { nextServer } from "./api";

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];

export async function getAuthHeaders(): Promise<{
  headers: { Cookie: string };
}> {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return { headers: { Cookie: cookieString } };
}

export async function registerServer(data: RegisterRequest): Promise<User> {
  const headers = await getAuthHeaders();
  const { data: res } = await nextServer.post<User>(
    "/auth/register",
    data,
    headers
  );
  return res;
}

export async function loginServer(data: LoginRequest): Promise<User> {
  const headers = await getAuthHeaders();
  const { data: res } = await nextServer.post<User>(
    "/auth/login",
    data,
    headers
  );
  return res;
}

export async function fetchNotes(
  search = "",
  page = 1,
  perPage = 12,
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> {
  const params: Record<string, string> = {
    page: String(page),
    perPage: String(perPage),
  };
  if (search) params.search = search;
  if (tag && tag.toLowerCase() !== "all") params.tag = tag;

  const res = await fetch(`/api/notes?${new URLSearchParams(params)}`, {
    method: "GET",
    headers: {
      cookie: (await cookies())
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; "),
    },
  });

  if (!res.ok) throw new Error(`Fetch error ${res.status}`);
  return (await res.json()) as { notes: Note[]; totalPages: number };
}

export async function deleteNote(id: string): Promise<Note | null> {
  try {
    const headers = await getAuthHeaders();
    const { data } = await nextServer.delete<Note>(`/notes/${id}`, headers);
    return data;
  } catch (err) {
    console.error("deleteNote error:", err);
    return null;
  }
}

export async function getTags(): Promise<string[]> {
  try {
    const res = await fetchNotes();
    const tagsFromNotes: string[] = Array.from(
      new Set(res.notes.map((note) => note.tag))
    );
    return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
  } catch (err) {
    console.error("getTags error:", err instanceof Error ? err.message : err);
    return DEFAULT_TAGS;
  }
}

export async function getUserProfile(): Promise<User> {
  const headers = await getAuthHeaders();
  const { data } = await nextServer.get<User>("/users/me", headers);
  return data;
}
