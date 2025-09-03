"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/app/loading";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import css from "./Notes.page.module.css";
import Link from "next/link";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isFetching, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedSearch, page, tag],
    queryFn: () => fetchNotes(debouncedSearch, page, 9, tag),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      <h2 className={css.title}>
        {tag ? `Notes tagged: ${tag}` : "All notes"}
      </h2>

      {isFetching && <Loader />}
      {isError && <p>Error: {(error as Error).message}</p>}
      {data && data.notes.length === 0 && !isFetching && (
        <p className={css.notfound}>
          {debouncedSearch
            ? `No notes found for "${debouncedSearch}"`
            : "No notes found"}
        </p>
      )}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
