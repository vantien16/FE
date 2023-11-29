import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8080/admin/statistics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Xử lý dữ liệu trả về từ API
          console.log(response.data);
          const apiData = response.data.data;
          const monthlyExchangeData = apiData.monthlyExchangeStatistics;
          const monthlyData = apiData.monthlyStatistics;
          const updatedChartData = Object.keys(monthlyData)
            .sort(
              (a, b) =>
                parseInt(a.replace("totalPostInMonth", "")) -
                parseInt(b.replace("totalPostInMonth", ""))
            )
            .map((key) => ({
              month: key.replace("totalPostInMonth", ""), // Lấy tháng từ tên key
              post: monthlyData[key],
              exchange:
                monthlyExchangeData[
                  key.replace("totalPostInMonth", "totalExchangeInMonth")
                ],
            }));

          setChartData(updatedChartData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [token]);

  return (
    <ResponsiveBar
      data={chartData}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["post", "exchange"]}
      indexBy="month"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      tooltip={({ id, value }) => (
        <strong style={{ color: colors.grey[100] }}>
          {id}: {value}
        </strong>
      )}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "month", // changed
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "", // changed
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 50,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 30,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      label={(e) => `${e.value}`}
      role="application"
      barAriaLabel={(e) =>
        `${e.id}: ${e.formattedValue} in month: ${e.indexValue}`
      }
    />
  );
};

export default BarChart;
