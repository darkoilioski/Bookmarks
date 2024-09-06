import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { BookmarkModal } from "./BookmarkModal";
import ShareIcon from "@mui/icons-material/Share";
import {
  Bookmark,
  useBookmarksQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useUpdateBookmarkMutation,
} from "../../api/queries/useBookmarks";

type BookmarksProps = {
  searchQuery?: string;
};

const Bookmarks: React.FC<BookmarksProps> = ({ searchQuery = "" }) => {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark | undefined>(
    undefined
  );
  const [bookmarkForUpdate, setBookmarkForUpdate] = useState<
    Bookmark | undefined
  >(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const bookmarksQuery = useBookmarksQuery();
  const createBookmarkMutation = useCreateBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();
  const updateBookmarkMutation = useUpdateBookmarkMutation();

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    bookmark: Bookmark
  ) => {
    event.stopPropagation();
    setCurrentBookmark(bookmark);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCopyToClipboard = () => {
    if (currentBookmark) {
      navigator.clipboard.writeText(currentBookmark.url);
      alert("Copied to clipboard!");
      handleCloseMenu();
    }
  };

  const handleSendEmail = () => {
    if (currentBookmark) {
      const { title, url, description } = currentBookmark;
      const mailto = `mailto:?subject=Check out this bookmark&body= ${title}%0D%0AURL: ${url}%0D%0A ${description}`;
      window.location.href = mailto;
      handleCloseMenu();
    }
  };

  const handleEdit = () => {
    setBookmarkForUpdate(currentBookmark);
    setShowBookmarkModal(true);
    handleCloseMenu();
  };

  const handleDelete = (bookmarkId: string) => {
    deleteBookmarkMutation.mutate(bookmarkId);
    setOpenDialog(false);
  };

  const handleOpenDialog = (bookmark: Bookmark) => {
    setCurrentBookmark(bookmark);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBookmark(undefined);
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {bookmarksQuery.isPending && <Box>LOADING ...</Box>}
          {createBookmarkMutation.isPending && <Box>CREATING...</Box>}
          {bookmarksQuery.data
            ?.filter(
              (bookmark) =>
                bookmark.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((bookmark) => (
              <Grid item xs={12} sm={12} key={bookmark.id}>
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 1060,
                    minWidth: 1060,
                    minHeight: 100,
                    position: "relative",
                    cursor: "pointer",
                    transition: "0.3s",
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                  onClick={() => handleOpenDialog(bookmark)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {bookmark.title}
                      </Typography>
                      <IconButton
                        onClick={(event) => handleOpenMenu(event, bookmark)}
                        sx={{ color: "burlywood" }}
                        aria-label="share-icon"
                      >
                        <ShareIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      component="a"
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#0073e6",
                        textDecoration: "none",
                        display: "block",
                        marginBottom: 1,
                      }}
                    >
                      {bookmark.url}
                    </Typography>
                    <Typography sx={{ color: "#666" }}>
                      {bookmark.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#999" }}>
                      {new Date().toLocaleDateString()}
                    </Typography>
                    <IconButton aria-label="bookmark-icon" disabled>
                      <BookmarkBorderIcon sx={{ color: "cornflowerblue" }} />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCopyToClipboard}>Copy to Clipboard</MenuItem>
        <MenuItem onClick={handleSendEmail}>Email To</MenuItem>
      </Menu>
      {showBookmarkModal && (
        <BookmarkModal
          open={showBookmarkModal}
          onClose={() => {
            setShowBookmarkModal(false);
            setBookmarkForUpdate(undefined);
          }}
          onSubmitData={(title, url, description) => {
            if (bookmarkForUpdate) {
              updateBookmarkMutation.mutate({
                ...bookmarkForUpdate,
                title,
                description,
                url,
              });
              setShowBookmarkModal(false);
            } else {
              createBookmarkMutation.mutate({ title, description, url });
              setShowBookmarkModal(false);
            }
          }}
          bookmark={bookmarkForUpdate}
        />
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            bgcolor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
            padding: "16px",
          }}
        >
          {currentBookmark?.title || "Bookmark Details"}
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>URL:</strong>{" "}
            <a
              href={currentBookmark?.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0073e6", textDecoration: "none" }}
            >
              {currentBookmark?.url}
            </a>
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Description:</strong> {currentBookmark?.description}
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ padding: 2, display: "flex", justifyContent: "space-between" }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button onClick={handleEdit} variant="contained" color="primary">
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(currentBookmark?.id || "")}
              variant="contained"
              sx={{ backgroundColor: "#f44336", color: "#fff" }}
            >
              Delete
            </Button>
          </Box>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ color: "#0073e6" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Bookmarks;
