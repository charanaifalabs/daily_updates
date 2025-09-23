import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addBook, updateBook } from "../features/books/bookSlice";
import { Book } from "../features/books/types";

interface BookFormProps {
  bookToEdit?: Book;
  onClose?: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ bookToEdit, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.books);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publication, setPublication] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setPublication(bookToEdit.publication || "");
      setPrice(bookToEdit.price ?? "");
      setDescription(bookToEdit.description || "");
    }
  }, [bookToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookData = {
      title,
      author,
      publication,
      price: price === "" ? 0 : Number(price),
      description,
    };

    if (bookToEdit) {
      dispatch(updateBook({ id: bookToEdit._id, bookData }));
    } else {
      dispatch(addBook(bookData));
    }

    if (onClose) onClose();

    if (!bookToEdit) {
      setTitle("");
      setAuthor("");
      setPublication("");
      setPrice("");
      setDescription("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "grid", gap: 2, mt: 2 }}
    >
      <Typography variant="h6">
        {bookToEdit ? "Edit Book" : "Add Book"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <TextField
        label="Publication"
        value={publication}
        onChange={(e) => setPublication(e.target.value)}
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === "" ? "" : Number(e.target.value))
        }
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading
          ? bookToEdit
            ? "Updating..."
            : "Saving..."
          : bookToEdit
          ? "Update Book"
          : "Add Book"}
      </Button>
    </Box>
  );
};

export default BookForm;
