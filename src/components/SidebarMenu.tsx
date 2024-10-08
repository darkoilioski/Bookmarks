import React from "react";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";

const SidebarMenu: React.FC = () => {
  return (
    <List component="nav" sx={{ width: "175px" }}>
      {/* Ставка во мени за навигација кон Bookmarks */}
      <ListItem button component="a" sx={{ width: "175px" }}>
        <NavLink
          to="/bookmarks"
          style={{
            textDecoration: "none",
            color: "inherit",
            width: "100%",
          }}
        >
          <ListItemText primary="Bookmarks" />
        </NavLink>
      </ListItem>
      {/* Ставка во мени за навигација кон Notes */}
      <ListItem button component="a" sx={{ width: "175px" }}>
        <NavLink
          to="/notes"
          style={{
            textDecoration: "none",
            color: "inherit",
            width: "100%",
          }}
        >
          <ListItemText primary="Notes" />
        </NavLink>
      </ListItem>
      <Divider />
    </List>
  );
};

export default SidebarMenu;
