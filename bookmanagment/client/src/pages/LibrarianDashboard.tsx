import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Toolbar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Pagination,
} from "@mui/material";
import AppBarHeader from "../components/AppBarHearder";

import BookCard from "../components/BookCard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchBooks,
  fetchBookRequests,
  createBookRequest,
} from "../features/books/bookSlice";
import { Book } from "../features/auth/authSlice";
import { useBookSearch } from "../hooks/useBookSearch";

const LibrarianDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allBooks, requests, loading, error } = useAppSelector((s) => s.books);
  const { user } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publication, setPublication] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const { searchTerm, setSearchTerm, filteredBooks } = useBookSearch(allBooks);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchBookRequests());
  }, [dispatch]);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPublication("");
    setPrice("");
    setDescription("");
    setSelectedBook(null);
    setRequestType("create");
  };

  const openCreateDialog = () => {
    resetForm();
    setRequestType("create");
    setOpen(true);
  };

  const submitRequest = () => {
    if (requestType === "create" && (!title || !author)) {
      alert("Please fill in title and author for create request");
      return;
    }
    if (requestType === "edit" && (!title || !author || !selectedBook)) {
      alert("Please fill in title, author and select a book for edit request");
      return;
    }
    if (requestType === "delete" && !selectedBook) {
      alert("Please select a book for delete request");
      return;
    }

    // requestType  action
    let action: "create" | "update" | "delete";
    switch (requestType) {
      case "edit":
        action = "update";
        break;
      case "delete":
        action = "delete";
        break;
      default:
        action = "create";
    }

    const payload: {
      action: "create" | "update" | "delete";
      title?: string;
      author?: string;
      description?: string;
      publication?: string;
      price?: number;
      bookId?: string;
    } = {
      action,
      title,
      author,
      description,
      publication,
    };

    if (requestType === "create" || requestType === "edit") {
      payload.price = Number(price);
    }

    if (requestType === "edit" || requestType === "delete") {
      payload.bookId = selectedBook!._id;
    }

    dispatch(createBookRequest(payload))
      .then((result) => {
        console.log("Request created successfully:", result);
        dispatch(fetchBookRequests());
        resetForm();
        setOpen(false);
        alert(
          `Request to ${action} book "${title}" has been submitted successfully!`
        );
      })
      .catch((err) => {
        console.error("Failed to create request:", err);
        console.error("Error details:", err.payload || err.message);
        if (
          err.payload?.includes("insufficient role") ||
          err.message?.includes("insufficient role")
        ) {
          alert(
            "Error: You need to be logged in as a librarian to create requests. Current role: " +
              user?.role
          );
        } else {
          alert(
            "Failed to create request: " +
              (err.payload || err.message || "Unknown error")
          );
        }
      });
  };

  return (
    <>
      <AppBarHeader />
      <Container sx={{ marginLeft: 20 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 1 }}>
          {user?.role === "admin"
            ? "Admin Testing Librarian Features"
            : "Librarian Dashboard"}
        </Typography>
        {user && (
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Welcome, {user.name}! (Role: {user.role})
          </Typography>
        )}
        {user?.role === "admin" && (
          <Typography
            variant="body2"
            color="warning.main"
            sx={{ mb: 2, p: 2, bgcolor: "#fff3cd", borderRadius: 1 }}
          >
            Warning: You are logged in as an admin. To test librarian features
            properly, please log in as a librarian.
          </Typography>
        )}

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={openCreateDialog}>
            Request: Create Book
          </Button>
          <Button variant="outlined" color="info" disabled>
            Note: All changes require admin approval
          </Button>
          {user?.role === "admin" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => (window.location.href = "/admin-dashboard")}
            >
              Switch to Admin Dashboard
            </Button>
          )}
        </Box>

        {loading && <Typography>Loading books...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <Typography variant="h6" sx={{ mt: 2, color: "primary.main" }}>
          My Book Requests ({requests?.length || 0})
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
                  bgcolor:
                    r.status === "pending"
                      ? "white"
                      : r.status === "approved"
                      ? "white"
                      : "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    {r.status!.toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="body2">Author: {r.author}</Typography>
                {r.price && (
                  <Typography variant="body2">Price: {r.price}</Typography>
                )}
                {r.publication && (
                  <Typography variant="body2">
                    Publication: {r.publication}
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "#f8f9fa",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No requests yet. Create your first book request above!
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h6" sx={{ mt: 2, color: "primary.main" }}>
          Available Books (View Only)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click Edit/Delete to request changes (requires admin approval)
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            All Books ({allBooks?.length || 0} total)
          </Typography>

          {loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Loading books...
            </Typography>
          ) : allBooks && allBooks.length > 0 ? (
            <>
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

              {/* Books Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                  mt: 1,
                }}
              >
                {currentBooks.map((b) => (
                  <BookCard key={b._id} book={b} />
                ))}
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No books found.
            </Typography>
          )}
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
      </Container>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Request{" "}
          {requestType === "create"
            ? "Create"
            : requestType === "edit"
            ? "Edit"
            : "Delete"}{" "}
          Book
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            This request will be sent to admin for approval
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          {requestType === "delete" ? (
            <Box>
              <Typography variant="h6" color="error">
                Are you sure you want to delete this book?
              </Typography>
              <Typography>
                <strong>Title:</strong> {title}
              </Typography>
              <Typography>
                <strong>Author:</strong> {author}
              </Typography>
            </Box>
          ) : (
            <>
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
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
              />
            </>
          )}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={submitRequest}
              sx={{ flex: 1 }}
            >
              Submit Request
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LibrarianDashboard;
