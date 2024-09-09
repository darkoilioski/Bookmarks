import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import { styled } from "@mui/system";
import MyLibrary from "./components/MyLibrary";
import NoteEditor from "./components/Notes/NoteEditor";
import logo from "./assets/DILOGO.png";

const Logo = styled("img")({
  width: "60px",
  height: "auto",
  cursor: "pointer",
});

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="fixed" style={{ backgroundColor: "#3f98e5" }}>
        <Toolbar>
          <Logo src={logo} alt="Logo" sx={{ pointerEvents: "none" }} />
          <NavLink to="/my-library">
            <Button
              sx={{
                color: "white",
                border: "1px solid lightgray",
                marginLeft: "5px",
              }}
            >
              My Library
            </Button>
          </NavLink>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Routes>
        <Route path="/my-library" element={<MyLibrary />} />
        <Route path="/notes/:noteId" element={<NoteEditor />} />
        <Route path="*" element={<Navigate to="/my-library" />} />
      </Routes>
    </Router>
  );
};

export default App;
