import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
// import { mockTransactions } from "../../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PetsIcon from "@mui/icons-material/Pets";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StoreIcon from "@mui/icons-material/Store";
import Header from "../../../components/admin/Header";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
// import LineChart from "../../../components/admin/LineChart";
// import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../../components/admin/BarChart";
import PieChart from "../../../components/admin/PieChart";

import StatBox from "../../../components/admin/StatBox";
// import ProgressCircle from "../../../components/admin/ProgressCircle";
import Team from "../team/Team";
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  // const curs = JSON.parse(localStorage.getItem("currentUser"));
  const [statistics, setStatistics] = useState({
    totalUser: 0,
    totalPostDisplay: 0,
    totalPet: 0,
    totalExchange: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedStatistics = response.data.data;
        setStatistics(fetchedStatistics);
        console.log(fetchedStatistics);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, []);

  return (
    <Box m="20px">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome back Admin" />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={statistics.totalUser}
            subtitle="Total User"
            progress="0.75"
            // increase="+14%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={statistics.totalPostDisplay}
            subtitle="Total Post"
            progress="0.50"
            // increase="+21%"
            icon={
              <PostAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={statistics.totalPostDelete}
            subtitle="Total Post Delete"
            progress="0.4"
            // decrease="+10%"
            icon={
              <DeleteForeverOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={statistics.totalPet}
            subtitle="Total Pet"
            progress="0.30"
            // increase="+5%"
            icon={
              <PetsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={statistics.totalExchange}
            subtitle="Total Exchange"
            progress="0.80"
            // increase="+43%"
            icon={
              <StoreIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={statistics.totalBalance}
            subtitle="Total Balance"
            progress="0.30"
            // increase="+43%"
            icon={
              <AttachMoneyOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 6"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          ></Box>
          <Box height="250px" m="-20px 0 0 0">
            <Team isDashboard={true} />
          </Box>
        </Box>
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box> */}

        {/* ROW 3 */}
        <Box
          gridColumn="span 5"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          p="30px"
          style={{ position: "relative" }}
        >
          <div style={{ width: "100%", height: "100%", position: "absolute" }}>
            <PieChart isDashboard={true} />
          </div>
        </Box>
        <Box
          gridColumn="span 7"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Post
          </Typography>
          <Box height="500px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
