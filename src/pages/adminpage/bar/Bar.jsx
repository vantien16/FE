import { Box } from "@mui/material";
import Header from "../../../components/admin/Header";
import BarChart from "../../../components/admin/BarChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Statistics Posts/Exchanges" subtitle="Posts/Exchanges" />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
