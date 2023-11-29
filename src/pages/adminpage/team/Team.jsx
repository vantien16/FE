import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../../components/admin/Header";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("token");
  const updateLocalStorage = (updatedRows) => {
    localStorage.setItem("users", JSON.stringify(updatedRows));
  };

  const csvData = rows.map((row) => ({
    ID: row.id,
    Name: row.name,
    "Phone Number": row.phone,
    Email: row.email,
    Balance: row.balance,
    Enable: row.enable,
    "Auth Provider": row.authProvider,
    "Access Level": row.accessLevel,
  }));

  const csvHeaders = [
    { label: "ID", key: "ID" },
    { label: "Name", key: "Name" },
    { label: "Phone Number", key: "Phone Number" },
    { label: "Email", key: "Email" },
    { label: "Balance", key: "Balance" },
    { label: "Enable", key: "Enable" },
    { label: "Auth Provider", key: "Auth Provider" },
    { label: "Access Level", key: "Access Level" },
  ];

  const handleBlockUser = (userId, userName) => {
    axios
      .post(`http://localhost:8080/admin/${userId}/block`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle success, update UI if needed
        console.log("User blocked:", response.data.data);
        const updatedRows = rows.map((user) =>
          user.id === userId ? { ...user, authProvider: "BLOCK_USER" } : user
        );
        setRows(updatedRows);
        updateLocalStorage(updatedRows);
        // Show a toast notification
        toast.success(`User ${userName} has been blocked`);
      })
      .catch((error) => {
        // Handle error
        console.error("Error blocking user:", error);
      });
  };

  const handleUnblockUser = (userId, userName) => {
    axios
      .post(`http://localhost:8080/admin/${userId}/offblock`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle success, update UI if needed
        console.log("User unblocked:", response.data.data);
        const updatedRows = rows.map((user) =>
          user.id === userId
            ? { ...user, authProvider: "NOT_BLOCK_USER" }
            : user
        );
        setRows(updatedRows);
        updateLocalStorage(updatedRows);
        // Show a toast notification
        toast.success(`User ${userName} has been unblocked`);
      })
      .catch((error) => {
        // Handle error
        console.error("Error unblocking user:", error);
      });
  };

  useEffect(() => {
    if (token) {
      // Read user data from localStorage on component initialization
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      if (storedUsers.length > 0) {
        setRows(storedUsers);
      } else {
        axios
          .get("http://localhost:8080/admin/getAllUser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const userData = response.data.data;
            const updatedRows = Array.isArray(userData)
              ? userData.map((user) => ({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  enable: user.enable,
                  authProvider: user.authProvider,
                  balance: user.balance,
                  accessLevel: user.role,
                }))
              : [];

            setRows(updatedRows);

            // Update localStorage to store initial user data
            updateLocalStorage(updatedRows);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [token]);

  useEffect(() => {
    // This will log rows every time it changes
    console.log(rows);
  }, [rows]);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0.4,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.8,
    },
    {
      field: "balance",
      headerName: "Balance",
    },
    {
      field: "enable",
      headerName: "Enable",
    },
    {
      field: "authProvider",
      headerName: "Auth Provider",
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 0.7,
      renderCell: ({ row: { id, name, authProvider, accessLevel } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessLevel === "ROLE_ADMIN"
                ? colors.greenAccent[600]
                : accessLevel === "ROLE_STAFF"
                ? colors.blueAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {accessLevel === "ROLE_USER" && (
              <>
                {authProvider !== "BLOCK_USER" ? (
                  <LockOpenOutlinedIcon
                    onClick={() => handleBlockUser(id, name)}
                    variant="contained"
                    color="primary"
                  />
                ) : (
                  <LockOutlinedIcon
                    onClick={() => handleUnblockUser(id, name)}
                    variant="contained"
                    color="secondary"
                  />
                )}
              </>
            )}
            {accessLevel === "ROLE_STAFF" && <SecurityOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessLevel}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m="20px"
      >
        <Header title="USER" subtitle="Managing the Users" />
        <Button
          variant="outlined"
          color="primary"
          style={{
            border: "1px solid #333",
            color: "white",
            backgroundColor: "#007bff",
            borderRadius: "4px",
            padding: "8px 16px",
            alignItems: "center",
          }}
        >
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename="users.csv"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Export
          </CSVLink>
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
      <ToastContainer />
    </div>
  );
};

export default Team;
