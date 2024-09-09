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

  // хук за преземање, креирање, бришење и ажурирање на обележувачи
  const bookmarksQuery = useBookmarksQuery(); // Преземање на обележувачи
  const createBookmarkMutation = useCreateBookmarkMutation(); // Креирање на нов обележувач
  const deleteBookmarkMutation = useDeleteBookmarkMutation(); // Бришење на обележувач
  const updateBookmarkMutation = useUpdateBookmarkMutation(); // Ажурирање на обележувач

  // Функција за отворање на менито за одреден обележувач
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    bookmark: Bookmark
  ) => {
    event.stopPropagation();
    setCurrentBookmark(bookmark);
    setAnchorEl(event.currentTarget);
  };

  // Функција за затворање на менито
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Функција за копирање на URL-то на обележувачот во clipboard
  const handleCopyToClipboard = () => {
    if (currentBookmark) {
      navigator.clipboard.writeText(currentBookmark.url);
      alert("Копирано во clipboard!");
      handleCloseMenu();
    }
  };

  // Функција за праќање на email со информациите за обележувачот
  const handleSendEmail = () => {
    if (currentBookmark) {
      const { title, url, description } = currentBookmark;
      const mailto = `mailto:?subject=Check out this bookmark&body= ${title}%0D%0AURL: ${url}%0D%0A ${description}`;
      window.location.href = mailto;
      handleCloseMenu();
    }
  };

  // Функција за уредување на обележувачот
  const handleEdit = () => {
    setBookmarkForUpdate(currentBookmark);
    setShowBookmarkModal(true);
    setOpenDialog(false);
    handleCloseMenu();
  };

  // Функција за бришење на обележувачот
  const handleDelete = (bookmarkId: string) => {
    deleteBookmarkMutation.mutate(bookmarkId);
    setOpenDialog(false);
  };

  // Функција за отворање на дијалогот со информации за обележувачот
  const handleOpenDialog = (bookmark: Bookmark) => {
    setCurrentBookmark(bookmark);
    setOpenDialog(true);
  };

  // Функција за затворање на дијалогот
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBookmark(undefined);
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
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
                      {/* Прикажување на насловот на обележувачот */}
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
                    {/* Прикажување на URL-то на обележувачот */}
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
                    {/* Прикажување на описот на обележувачот */}
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
                    {/* Прикажување на датумот */}
                    <Typography variant="body2" sx={{ color: "#999" }}>
                      {new Date().toLocaleDateString()}
                    </Typography>
                    {/* Икона за обележување*/}
                    <IconButton aria-label="bookmark-icon" disabled>
                      <BookmarkBorderIcon sx={{ color: "cornflowerblue" }} />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
      {/* Мени за опции: "Copy to clipboard", "email to" */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCopyToClipboard}>Copy to Clipboard</MenuItem>
        <MenuItem onClick={handleSendEmail}>Email to</MenuItem>
      </Menu>
      {/* Модал за додавање или уредување на обележувач */}
      {showBookmarkModal && (
        <BookmarkModal
          open={showBookmarkModal}
          onClose={() => {
            setShowBookmarkModal(false);
            setBookmarkForUpdate(undefined);
          }}
          onSubmitData={(title, url, description) => {
            if (bookmarkForUpdate) {
              // Ако има обележувач за ажурирање
              updateBookmarkMutation.mutate({
                ...bookmarkForUpdate,
                title,
                description,
                url,
              });
              setShowBookmarkModal(false);
            } else {
              // Ако нема, тогаш додај нов обележувач
              createBookmarkMutation.mutate({ title, description, url });
              setShowBookmarkModal(false);
            }
          }}
          bookmark={bookmarkForUpdate}
        />
      )}
      {/* Дијалог за прикажување на детали за обележувачот */}
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
          }}
        >
          {currentBookmark?.title}
        </DialogTitle>
        <DialogContent>
          <Box>
            {/* Прикажување на URL-то и описот на обележувачот во дијалогот */}
            <Typography sx={{ color: "#666", fontWeight: "bold", mb: 2 }}>
              URL:{" "}
              <Typography
                component="a"
                href={currentBookmark?.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#0073e6", textDecoration: "none" }}
              >
                {currentBookmark?.url}
              </Typography>
            </Typography>
            <Typography>{currentBookmark?.description}</Typography>
          </Box>
        </DialogContent>
        {/* Копчиња за акција во дијалогот */}
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box>
            <Button
              onClick={handleEdit}
              variant="contained"
              color="secondary"
              sx={{ fontWeight: "bold", mr: 2, backgroundColor: "#3F98E5" }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(currentBookmark!.id)}
              variant="contained"
              color="error"
              sx={{ fontWeight: "bold" }}
            >
              Delete
            </Button>
          </Box>
          <Button
            onClick={() => handleCloseDialog()}
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "blue",
              border: "2px solid lightblue",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Bookmarks;
