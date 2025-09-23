import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Toolbar,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Pagination,
} from "@mui/material";
import AppBarHeader from "../components/AppBarHearder";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUsers } from "../features/auth/authSlice";
import {
  fetchBooks,
  deleteBook,
  fetchBookRequests,
  handleBookRequest,
} from "../features/books/bookSlice";
import BookForm from "../components/BookForm";
import { Book } from "../features/books/types";
import { useBookSearch } from "../hooks/useBookSearch";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { allBooks: books, requests } = useAppSelector((s) => s.books);

  const [formVisible, setFormVisible] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);
  const [detailsBook, setDetailsBook] = useState<Book | null>(null);
  const { searchTerm, setSearchTerm, filteredBooks } = useBookSearch(books);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBooks());
    dispatch(fetchBookRequests());
  }, [dispatch]);

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
    setFormVisible(true);
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <>
      <AppBarHeader />
      <Container sx={{ mt: 2 }}>
        <Toolbar />
        <Typography variant="h3" sx={{ mb: 1 }}>
          Admin Dashboard
        </Typography>
        {user && (
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Welcome, {user.name}! (Role: {user.role})
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => {
            setBookToEdit(undefined);
            setFormVisible(true);
          }}
        >
          Create Book
        </Button>

        <Dialog
          open={formVisible}
          onClose={() => setFormVisible(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {bookToEdit ? "Edit Book" : "Add New Book"}
            <IconButton
              aria-label="close"
              onClick={() => setFormVisible(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              ×
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <BookForm
              bookToEdit={bookToEdit}
              onClose={() => setFormVisible(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Requests Panel */}
        <Typography variant="h5" sx={{ mb: 1, mt: 2, color: "primary.main" }}>
           Librarian Requests ({requests?.length || 0})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Review and approve/reject librarian requests for book changes
        </Typography>
        <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
          {requests && requests.length > 0 ? (
            requests.map((r) => (
              <Box
                key={r._id}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor:
                    r.status === "pending"
                      ? "white"
                      : r.status === "approved"
                      ? "white"
                      : "white",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {r.action === "create"
                        ? "CREATE"
                        : r.action === "update"
                        ? "EDIT"
                        : "DELETE"}{" "}
                      — {r.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          r.status === "pending"
                            ? "#ffc107"
                            : r.status === "approved"
                            ? "#28a745"
                            : "#dc3545",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {r.status?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">Author: {r.author}</Typography>
                  {r.price && (
                    <Typography variant="body2">Price: {r.price}</Typography>
                  )}
                  {r.publishedYear && (
                    <Typography variant="body2">
                      Publication: {r.publishedYear}
                    </Typography>
                  )}
                  {r.requestedBy?.name ? (
                    <Typography variant="body2" color="text.secondary">
                      Requested by: {r.requestedBy.name}
                    </Typography>
                  ) : null}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    disabled={r.status !== "pending"}
                    onClick={() =>
                      dispatch(
                        handleBookRequest({
                          id: r._id || "",
                          status: "approved",
                        })
                      )
                        .then(() => {
                          dispatch(fetchBookRequests());
                          dispatch(fetchBooks());
                        })
                        .catch((err) => {
                          console.error("Failed to approve request:", err);
                          alert(
                            "Failed to approve request: " +
                              (err.message || "Unknown error")
                          );
                        })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={r.status !== "pending"}
                    onClick={() =>
                      dispatch(
                        handleBookRequest({
                          id: r._id || "",
                          status: "rejected",
                        })
                      )
                        .then(() => dispatch(fetchBookRequests()))
                        .catch((err) => {
                          console.error("Failed to reject request:", err);
                          alert(
                            "Failed to reject request: " +
                              (err.message || "Unknown error")
                          );
                        })
                    }
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No requests.</Typography>
          )}
        </Box>

        {/* Books List */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Books
        </Typography>

        {/* Search Books */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search books..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {currentBooks.map((book) => (
            <Box key={book._id}>
              <Card
                sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
                onClick={() => setDetailsBook(book)}
              >
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography>Author: {book.author}</Typography>
                  {book.publication && (
                    <Typography>Publication: {book.publication}</Typography>
                  )}
                  <Typography>Price: {book.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBook(book);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book._id);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}

        {/* Book Details Dialog */}
        <Dialog
          open={!!detailsBook}
          onClose={() => setDetailsBook(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {detailsBook?.title}
            <IconButton
              aria-label="close"
              onClick={() => setDetailsBook(null)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              ×
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {detailsBook && (
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography>
                  <strong>Author:</strong> {detailsBook.author}
                </Typography>
                {detailsBook.publication && (
                  <Typography>
                    <strong>Publication:</strong> {detailsBook.publication}
                  </Typography>
                )}
                {typeof detailsBook.price !== "undefined" && (
                  <Typography>
                    <strong>Price:</strong> {detailsBook.price}
                  </Typography>
                )}
                {detailsBook.description && (
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    <strong>Description:</strong> {detailsBook.description}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminDashboard;
