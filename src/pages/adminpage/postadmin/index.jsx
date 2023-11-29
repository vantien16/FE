import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/admin/Header";
import { CSVLink } from "react-csv";

const Posts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // Gọi API để lấy danh sách bài đăng từ phía backend
      axios
        .get("http://localhost:8080/admin/getAllPost", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Lấy dữ liệu từ response và cập nhật vào `rows`
          console.log(response.data.data);
          const postData = response.data.data;
          const updatedRows = Array.isArray(postData)
            ? postData.map((post, index) => ({
                id: index + 1,
                name: post.user_name,
                content: post.content,
                date: formatDate(post.create_date),
                image: post.image,
                enable: post.enable,
                like: post.total_like,
                comment: post.total_comment,
              }))
            : [];

          setRows(updatedRows);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  const formatDate = (dateString) => {
    // Split the date string by a common set of date separators
    const dateComponents = dateString.split(/[/\- ]/);

    // Reorder the components to match the standard format: YYYY-MM-DD
    const formattedDate = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;

    return formattedDate;
  };

  const csvData = rows.map((row) => ({
    ID: row.id,
    User: row.name,
    Content: row.content,
    Date: row.date,
    Image: row.image,
    Enable: row.enable,
    Like: row.like,
    Comment: row.comment,
  }));

  const csvHeaders = [
    { label: "ID", key: "ID" },
    { label: "User", key: "User" },
    { label: "Content", key: "Content" },
    { label: "Date", key: "Date" },
    { label: "Image", key: "Image" },
    { label: "Enable", key: "Enable" },
    { label: "Like", key: "Like" },
    { label: "Comment", key: "Comment" },
  ];

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "User",
      flex: 0.5,
    },
    {
      field: "content",
      headerName: "Content",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      type: "date",
      valueGetter: (params) => {
        return new Date(params.value);
      },
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
    },
    {
      field: "enable",
      headerName: "Enable",
    },
    {
      field: "like",
      headerName: "Like",
    },
    {
      field: "comment",
      headerName: "Comment",
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
        <Header title="POSTS" subtitle="List of User Posts" />
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
            filename="posts.csv"
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
          // Tùy chỉnh giao diện của DataGrid theo nhu cầu của bạn
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

export default Posts;
