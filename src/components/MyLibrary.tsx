import React, { useState } from "react";
import {
  Box,
  Divider,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { styled } from "@mui/system";
import AllBookmarks from "./Bookmarked/Bookmarks";
import AllNotes from "./Notes/Notes";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import NoteAddIcon from "@mui/icons-material/Note";
import { useCreateBookmarkMutation } from "../api/queries/useBookmarks";
import { BookmarkModal } from "./Bookmarked/BookmarkModal";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";

const StyledInputBase = styled(InputBase)({
  marginLeft: "8px",
  flex: 1,
  padding: "8px 12px",
  borderRadius: 4,
  backgroundColor: "#f0f0f0",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
});

const MyLibrary: React.FC = () => {
  const navigate = useNavigate();

  const [shouldShowBookmarks, setShouldShowBookmarks] = useState(true);
  const [shouldShowNotes, setShouldShowNotes] = useState(true);

  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const createBookmarkMutation = useCreateBookmarkMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const actions = [
    {
      icon: <BookmarkAddIcon />,
      name: "Add Bookmark",
      onClick: () => {
        setShowBookmarkModal(true);
      },
    },
    {
      icon: <NoteAddIcon />,
      name: "Add Note",
      onClick: () => {
        navigate("/notes/new");
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          background: "#3F98E5",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box
          sx={{
            width: "80%",
            display: "flex",
            alignItems: "center",
            margin: "0px",
          }}
        >
          <StyledInputBase
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Пребарај..."
            inputProps={{ "aria-label": "search" }}
          />
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            icon={<SpeedDialIcon />}
            direction="down"
            sx={{
              position: "relative",
              right: "-14px",
              top: "65px",
            }}
          >
            {actions.map((action) => (
              <SpeedDialAction
                onClick={action.onClick}
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <Box sx={{ width: "78%", display: "flex" }}>
          <List component="nav" sx={{ width: "175px" }}>
            <ListItemButton
              onClick={() => {
                setShouldShowBookmarks((prev) => !prev);
              }}
              component="a"
              sx={{ width: "175px" }}
            >
              <ListItemText primary="Bookmarks" />
              {shouldShowBookmarks && <CheckIcon />}
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                setShouldShowNotes((prev) => !prev);
              }}
              component="a"
              sx={{ width: "175px" }}
            >
              <ListItemText primary="Notes" />
              {shouldShowNotes && <CheckIcon />}
            </ListItemButton>
            <Divider />
          </List>
          <Box sx={{ flex: 1, padding: "16px" }}>
            {shouldShowBookmarks && <AllBookmarks searchQuery={searchQuery} />}
            {shouldShowNotes && <AllNotes searchQuery={searchQuery} />}
          </Box>
        </Box>
      </Box>
      {showBookmarkModal && (
        <BookmarkModal
          open={showBookmarkModal}
          onClose={() => {
            setShowBookmarkModal(false);
          }}
          onSubmitData={(title, url, description) => {
            createBookmarkMutation.mutate({ title, description, url });
            setShowBookmarkModal(false);
          }}
        />
      )}
    </>
  );
};

export default MyLibrary;
