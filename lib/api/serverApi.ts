import { User } from "@/types/user";
import { Note } from "@/types/note";
import { RegisterRequest, LoginRequest } from "@/types/auth";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";

export async function getAuthHeaders(): Promise<{
  headers: {
    Cookie: string;
  };
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
  const { data: res } = await api.post<User>("/auth/register", data, headers);
  return res;
}

export async function loginServer(data: LoginRequest): Promise<User> {
  const headers = await getAuthHeaders();
  const { data: res } = await api.post<User>("/auth/login", data, headers);
  return res;
}

export async function fetchNotes(
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

  const headers = await getAuthHeaders();
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      ...headers,
    }
  );
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const headers = await getAuthHeaders();
  const { data } = await api.delete<Note>(`/notes/${id}`, headers);
  return data;
}

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];

export async function getTags(): Promise<string[]> {
  const { notes } = await fetchNotes("");
  const tagsFromNotes: string[] = Array.from(
    new Set(notes.map((note: any) => note.tag as string))
  );
  return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
}
