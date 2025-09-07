"use client";

import { Note } from "@/types/note";
import { User } from "@/types/user";
import { RegisterRequest, LoginRequest } from "@/types/auth";
import { nextServer } from "./api";
import { isAxiosError } from "axios";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];

export async function registerClient(data: RegisterRequest): Promise<User> {
  try {
    const { data: user } = await nextServer.post<User>("/auth/register", data);
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
}

export async function loginClient(data: LoginRequest): Promise<User> {
  try {
    const { data: user } = await nextServer.post<User>("/auth/login", data);
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
}

export async function logoutClient(): Promise<void> {
  try {
    await nextServer.post("/auth/logout");
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
    throw new Error("Logout failed");
  }
}

export async function checkSession(): Promise<void> {
  try {
    await nextServer.get("/auth/session");
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Session check failed");
    }
    throw new Error("Session check failed");
  }
}

export async function getUserProfile(): Promise<User> {
  try {
    const { data: user } = await nextServer.get<User>("/users/me");
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
    const { data: user } = await nextServer.patch<User>("/users/me", update);
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
    throw new Error("Update failed");
  }
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

    const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
      params,
    });
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
    const { data } = await nextServer.get<Note>(`/notes/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Fetching note failed");
    }
    throw new Error("Fetching note failed");
  }
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  try {
    const { data } = await nextServer.post<Note>("/notes", note);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Creating note failed");
    }
    throw new Error("Creating note failed");
  }
}

export async function deleteNoteClient(id: string): Promise<Note> {
  try {
    const { data } = await nextServer.delete<Note>(`/notes/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Deleting note failed");
    }
    throw new Error("Deleting note failed");
  }
}

export async function getTagsClient(): Promise<string[]> {
  try {
    const res = await fetchNotesClient();
    const tagsFromNotes: string[] = Array.from(
      new Set(res.notes.map((note) => note.tag))
    );
    return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
  } catch (error) {
    console.error("Cannot fetch tags:", error);
    return DEFAULT_TAGS;
  }
}
