import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import NoteIcon from "@mui/icons-material/Note";
import ShareIcon from "@mui/icons-material/Share";
import { NoteModal } from "./NoteM";
import {
  Note,
  useNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "../../api/queries/useNotes";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

type NotesProps = {
  searchQuery?: string;
};

function stripHtml(htmlNote: string): string {
  const div = document.createElement("div");
  div.innerHTML = decodeURIComponent(htmlNote);
  return div.textContent || div.innerText || "";
}

const Notes: React.FC<NotesProps> = ({ searchQuery = "" }) => {
  const navigate = useNavigate();

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForUpdate, setNoteForUpdate] = useState<Note>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const notesQuery = useNotesQuery();
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, note: Note) => {
    event.stopPropagation(); // Спречува пропагирање на настанот
    setAnchorEl(event.currentTarget);
    setSelectedNote(note);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const handleCopyToClipboard = (note: Note) => {
    navigator.clipboard.writeText(
      `Title: ${note.title}\nContent: ${note.content}`
    );
    alert("Copied to clipboard!");
    handleCloseMenu();
  };

  const handleEmailNote = (note: Note) => {
    const subject = encodeURIComponent(`Note: ${note.title}`);
    const body = encodeURIComponent(`${note.title}\n ${note.content}`);
    window.open(`mailto:?subject=${subject}&body=${stripHtml(body)}`, "_self");
    handleCloseMenu();
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {notesQuery.isPending && <Box>LOADING ...</Box>}
          {createNoteMutation.isPending && <Box>CREATING...</Box>}
          {notesQuery.data
            ?.filter(
              (note) =>
                note.content
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                note.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((note) => (
              <Grid item xs={12} sm={12} key={note.id}>
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 1060,
                    minWidth: 1060,
                    position: "relative",
                    cursor: "pointer",
                    transition: "0.3s",
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <CardContent
                    sx={{
                      maxHeight: 180, // Максимална висина на картичката
                      overflow: "hidden", // Скриј го вишокот текст
                      textOverflow: "ellipsis", // Прикажи тројки точки за предолг текст
                      "&:hover": {
                        overflow: "auto", // Прикажи го целиот текст кога корисникот ќе ја отвори картичката
                      },
                    }}
                  >
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
                        {note.title}
                      </Typography>
                      <IconButton
                        onClick={(event) => handleOpenMenu(event, note)}
                        sx={{ color: "burlywood" }}
                        aria-label="share-icon"
                      >
                        <ShareIcon />
                      </IconButton>
                    </Box>
                    <Typography sx={{ color: "#666" }}>
                      {parse(note.content)}
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
                    <IconButton aria-label="note-icon" disabled>
                      <NoteIcon sx={{ color: "cornflowerblue" }} />
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
        <MenuItem onClick={() => handleCopyToClipboard(selectedNote!)}>
          Copy to Clipboard
        </MenuItem>
        <MenuItem onClick={() => handleEmailNote(selectedNote!)}>
          Email to
        </MenuItem>
      </Menu>
      {showNoteModal && (
        <NoteModal
          open={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setNoteForUpdate(undefined);
          }}
          onSubmitData={(title, content) => {
            if (noteForUpdate) {
              updateNoteMutation.mutate({
                ...noteForUpdate,
                title,
                content,
              });
              setShowNoteModal(false);
            } else {
              createNoteMutation.mutate({ title, content });
              setShowNoteModal(false);
            }
          }}
          note={noteForUpdate}
        />
      )}
    </>
  );
};

export default Notes;
