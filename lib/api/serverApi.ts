import { User } from "@/types/user";
import { Note } from "@/types/note";
import { RegisterRequest, LoginRequest } from "@/types/auth";
import { cookies } from "next/headers";
import { nextServer } from "./api";
import { isAxiosError } from "axios";

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];

export async function getAuthHeaders(): Promise<{
  headers: { Cookie: string };
}> {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return {
    headers: { Cookie: cookieString },
  };
}

export async function registerServer(data: RegisterRequest): Promise<User> {
  try {
    const headers = await getAuthHeaders();
    const { data: user } = await nextServer.post<User>(
      "/auth/register",
      data,
      headers
    );
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
}

export async function loginServer(data: LoginRequest): Promise<User> {
  try {
    const headers = await getAuthHeaders();
    const { data: user } = await nextServer.post<User>(
      "/auth/login",
      data,
      headers
    );
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
}

export async function logoutServer(): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    await nextServer.post("/auth/logout", {}, headers);
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
    throw new Error("Logout failed");
  }
}

export async function getUserProfile(): Promise<User> {
  try {
    const headers = await getAuthHeaders();
    const { data: user } = await nextServer.get<User>("/users/me", headers);
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Unauthorized");
    }
    throw new Error("Unauthorized");
  }
}

export async function updateUser(
  update: Partial<{ username: string }>
): Promise<User> {
  try {
    const headers = await getAuthHeaders();
    const { data: user } = await nextServer.patch<User>(
      "/users/me",
      update,
      headers
    );
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
    throw new Error("Update failed");
  }
}

export async function fetchNotes(
  search = "",
  page = 1,
  perPage = 12,
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> {
  try {
    const headers = await getAuthHeaders();
    const params: Record<string, string> = {
      page: String(page),
      perPage: String(perPage),
    };
    if (search) params.search = search;
    if (tag && tag.toLowerCase() !== "all") params.tag = tag;

    const { data } = await nextServer.get<{
      notes: Note[];
      totalPages: number;
    }>("/notes", headers);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Fetching notes failed");
    }
    throw new Error("Fetching notes failed");
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const headers = await getAuthHeaders();
    const { data } = await nextServer.get<Note>(`/notes/${id}`, headers);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Fetching note failed");
    }
    throw new Error("Fetching note failed");
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const headers = await getAuthHeaders();
    const { data } = await nextServer.delete<Note>(`/notes/${id}`, headers);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Deleting note failed");
    }
    throw new Error("Deleting note failed");
  }
}

export async function getTags(): Promise<string[]> {
  try {
    const res = await fetchNotes();
    const tagsFromNotes: string[] = Array.from(
      new Set(res.notes.map((note) => note.tag))
    );
    return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Fetching tags failed");
    }
    throw new Error("Fetching tags failed");
  }
}
