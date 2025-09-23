import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Book } from "../features/books/types";

interface Props {
  book: Book;
  onBorrow?: (bookId: string) => void;
  onReturn?: () => void;
  onPurchase?: (bookId: string, price?: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BookCard: React.FC<Props> = ({
  book,
  onBorrow,
  onReturn,
  onPurchase,
  onEdit,
  onDelete,
}) => {
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "borrowed":
        return "warning";
      case "sold":
        return "error";
      default:
        return "default";
    }
  };

  const handleBorrowConfirm = () => {
    if (onBorrow) {
      onBorrow(book._id);
    }
    setBorrowDialogOpen(false);
  };

  const handlePurchaseConfirm = () => {
    if (onPurchase) {
      onPurchase(book._id, book.price);
    }
    setPurchaseDialogOpen(false);
  };

  const handleReturnConfirm = () => {
    if (onReturn) {
      onReturn();
    }
    setReturnDialogOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Author :-</b> {book.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Price :-</b> {book.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Description:-</b> {book.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={book.status || "available"}
            color={getStatusColor(book.status || "available")}
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        {onBorrow && (
          <Button size="small" onClick={() => setBorrowDialogOpen(true)}>
            Borrow
          </Button>
        )}
        {onReturn && (
          <Button size="small" onClick={() => setReturnDialogOpen(true)}>
            Return
          </Button>
        )}
        {onPurchase && (
          <Button size="small" onClick={() => setPurchaseDialogOpen(true)}>
            Purchase
          </Button>
        )}
        {onEdit && (
          <IconButton size="small" onClick={onEdit}>
            Edit
          </IconButton>
        )}
        {onDelete && (
          <IconButton size="small" onClick={onDelete}>
            Delete
          </IconButton>
        )}
      </CardActions>

      {/* Borrow Confirmation Dialog */}
      <Dialog
        open={borrowDialogOpen}
        onClose={() => setBorrowDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Borrow Confirm Book Borrow
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to borrow "{book.title}" by {book.author}?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Book Details:</strong>
            </Typography>
            <Typography variant="body2">Title: {book.title}</Typography>
            <Typography variant="body2">Author: {book.author}</Typography>
            <Typography variant="body2">Price: {book.price}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBorrowConfirm}
            variant="contained"
            color="primary"
          >
            Confirm Borrow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Confirmation Dialog */}
      <Dialog
        open={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Purchase Confirm Book Purchase
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to purchase "{book.title}" by {book.author}?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Book Details:</strong>
            </Typography>
            <Typography variant="body2">Title: {book.title}</Typography>
            <Typography variant="body2">Author: {book.author}</Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "success.main" }}
            >
              Price: {book.price}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePurchaseConfirm}
            variant="contained"
            color="success"
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Confirmation Dialog */}
      <Dialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Return Confirm Book Return
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to return "{book.title}" by {book.author}?
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Book Details:</strong>
            </Typography>
            <Typography variant="body2">Title: {book.title}</Typography>
            <Typography variant="body2">Author: {book.author}</Typography>
            <Typography variant="body2">Price: {book.price}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReturnConfirm}
            variant="contained"
            color="warning"
          >
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BookCard;
