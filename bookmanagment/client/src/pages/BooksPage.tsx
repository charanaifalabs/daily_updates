import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Modal,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchBooks, deleteBook } from "../features/books/bookSlice";
import BookForm from "../components/BookForm";
import { Book } from "../features/books/types";

const BooksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  const handleEdit = (book: Book) => {
    setEditBook(book);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditBook(null);
    setModalOpen(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Books</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAdd}>
        Add New Book
      </Button>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <List>
        {books.map((book) => (
          <ListItem
            key={book._id}
            secondaryAction={
              <Box>
                <Button color="primary" onClick={() => handleEdit(book)}>
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDelete(book._id)}>
                  Delete
                </Button>
              </Box>
            }
          >
            <ListItemText
              primary={book.title}
              secondary={`${book.author} | ${book.publication || "N/A"}`}
            />
          </ListItem>
        ))}
      </List>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            width: 400,
          }}
        >
          <BookForm
            bookToEdit={editBook || undefined}
            onClose={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default BooksPage;
