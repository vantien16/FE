import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    setAnchorEl(null);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        {/* <div> */}
        <IconButton onClick={openDropdown}>
          <SettingsOutlinedIcon />
        </IconButton>
        <Popover
          open={isDropdownOpen}
          anchorEl={anchorEl}
          onClose={closeDropdown}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <List>
            <ListItem button onClick={handleLogout}>
              {/* <ExitToAppIcon /> */}
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Popover>
        {/* </div> */}
      </Box>
    </Box>
  );
};

export default Topbar;
