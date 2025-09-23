import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Toolbar,
  Box,
  Alert,
  Snackbar,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import AppBarHeader from "../components/AppBarHearder";
import BookCard from "../components/BookCard";
import { useBookSearch } from "../hooks/useBookSearch";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchBooks,
  fetchUserBooks,
  borrow,
  purchase,
  returnBook,
} from "../features/books/bookSlice";

const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allBooks, borrowed, purchased, loading, error } = useAppSelector(
    (s) => s.books
  );

  const { user } = useAppSelector((s) => s.auth);

  const { searchTerm, setSearchTerm, filteredBooks } = useBookSearch(allBooks);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchUserBooks());
  }, [dispatch]);

  const handleBorrow = async (bookId: string) => {
    try {
      await dispatch(borrow({ bookId })).unwrap();
      setSnackbar({
        open: true,
        message: "Book borrowed successfully!",
        severity: "success",
      });
      dispatch(fetchBooks());
      dispatch(fetchUserBooks());
    } catch (err) {
      const message =
        (err as { message?: string })?.message || "Failed to borrow book";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handlePurchase = async (bookId: string, price?: number) => {
    try {
      await dispatch(purchase({ bookId, price })).unwrap();
      setSnackbar({
        open: true,
        message: "Book purchased successfully!",
        severity: "success",
      });
      dispatch(fetchBooks());
      dispatch(fetchUserBooks());
    } catch (err) {
      const message =
        (err as { message?: string })?.message || "Failed to purchase book";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleReturn = async (bookId: string) => {
    try {
      await dispatch(returnBook({ bookId })).unwrap();
      setSnackbar({
        open: true,
        message: "Book returned successfully!",
        severity: "success",
      });
      dispatch(fetchBooks());
      dispatch(fetchUserBooks());
    } catch (err) {
      const message =
        (err as { message?: string })?.message || "Failed to return book";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleRefresh = () => {
    dispatch(fetchBooks());
    dispatch(fetchUserBooks());
  };

  return (
    <>
      <AppBarHeader />
      <Container sx={{ marginLeft: 20 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 1 }}>
          User Dashboard
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {user && (
            <Typography variant="h6" color="primary">
              Welcome, {user.name}! (Role: {user.role})
            </Typography>
          )}
          <Button variant="outlined" onClick={handleRefresh} disabled={loading}>
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* All Books */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            All Books ({allBooks?.length || 0} total)
          </Typography>

          {/* Search Field */}
          <TextField
            label="Search books..."
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            value={searchTerm} // from useBookSearch hook
            onChange={(e) => setSearchTerm(e.target.value)} // update search term
          />

          {loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Loading books...
            </Typography>
          ) : filteredBooks.length > 0 ? ( // use filteredAllBooks instead of allBooks
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
                <BookCard
                  key={b._id}
                  book={b}
                  onBorrow={b.status === "available" ? handleBorrow : undefined}
                  onPurchase={
                    b.status === "available" ? handlePurchase : undefined
                  }
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No books found.
            </Typography>
          )}

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
        </Box>

        {/* Borrowed Books */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">
            My Borrowed Books ({borrowed?.length || 0})
          </Typography>
          {borrowed && borrowed.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Books you have borrowed and can return
            </Typography>
          )}
          {borrowed && borrowed.length > 0 ? (
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
              {borrowed.map((r) => (
                <BookCard
                  key={r._id}
                  book={r.book}
                  onReturn={() => handleReturn(r.book._id)}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No borrowed books found. Borrow a book to see it here!
            </Typography>
          )}
        </Box>

        {/* Purchased Books */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">
            My Purchased Books ({purchased?.length || 0})
          </Typography>
          {purchased && purchased.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Books you have purchased and own
            </Typography>
          )}
          {purchased && purchased.length > 0 ? (
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
              {purchased.map((p) => (
                <BookCard key={p._id} book={p.book} />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No purchased books found. Purchase a book to see it here!
            </Typography>
          )}
        </Box>
      </Container>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserDashboard;
