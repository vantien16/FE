import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/admin/Header";
import { tokens } from "../../../theme";
import { CSVLink } from "react-csv";

const PetsUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // Fetch a list of pets from the backend
      axios
        .get("http://localhost:8080/admin/getAllPet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          const petData = response.data.data;
          const updatedRows = Array.isArray(petData)
            ? petData.map((pet, index) => ({
                id: index + 1,
                user: pet.user_name,
                name: pet.name,
                description: pet.description,
                image: pet.image,
                pet_type: pet.petType_name,
                status: pet.status,
                // Add more fields as needed
              }))
            : [];

          setRows(updatedRows);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  const csvData = rows.map((row) => ({
    ID: row.id,
    User: row.user,
    "Pet Type": row.pet_type,
    Name: row.name,
    Description: row.description,
    Image: row.image,
    Status: row.status,
  }));

  const csvHeaders = [
    { label: "ID", key: "ID" },
    { label: "User", key: "User" },
    { label: "Pet Type", key: "Pet Type" },
    { label: "Name", key: "Name" },
    { label: "Description", key: "Description" },
    { label: "Image", key: "Image" },
    { label: "Status", key: "Status" },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "user",
      headerName: "User",
      flex: 0.5,
    },
    {
      field: "pet_type",
      headerName: "Pet Type",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Image",
    },

    {
      field: "status",
      headerName: "Status",
    },
    // Add more fields as needed
  ];

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m="20px"
      >
        <Header title="PETS" subtitle="List of Pets" />
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
            filename="pets.csv"
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
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </div>
  );
};

export default PetsUser;
