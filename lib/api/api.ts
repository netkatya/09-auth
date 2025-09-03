import axios, { type AxiosResponse } from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page = 1,
  perPage = 9,
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string> = {
    page: String(page),
    perPage: String(perPage),
  };
  if (search.trim() !== "") {
    params.search = search;
  }

  if (tag && tag.toLowerCase() !== "all") {
    params.tag = tag;
  }

  const config = {
    params,
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  };
  const response = await axios.get<FetchNotesResponse>(BASE_URL, config);
  return response.data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const config = {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  };
  const response = await axios.post<Note>(BASE_URL, note, config);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const config = {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  };
  const response: AxiosResponse<Note> = await axios.delete(
    `${BASE_URL}/${id}`,
    config
  );
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  };
  const response: AxiosResponse<Note> = await axios.get(
    `${BASE_URL}/${id}`,
    config
  );
  return response.data;
};

const DEFAULT_TAGS = ["Todo", "Personal", "Work", "Shopping", "Meeting"];

export const getTags = async (): Promise<string[]> => {
  const { notes } = await fetchNotes("");
  const tagsFromNotes = Array.from(new Set(notes.map((note) => note.tag)));
  return Array.from(new Set([...DEFAULT_TAGS, ...tagsFromNotes]));
};
