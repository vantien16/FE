import { Box } from "@mui/material";
import Header from "../../../components/admin/Header";
import PieChart from "../../../components/admin/PieChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Statistics User/Posts/Pet/" subtitle="User/Post/Pet" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
