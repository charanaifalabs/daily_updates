import { useState, useMemo } from "react";
import { Book } from "../features/books/types";

export const useBookSearch = (books: Book[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (b.publication?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      ),
    [books, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredBooks };
};
