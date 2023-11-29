import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import axios from "axios";

const PieChart = () => {
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
          const apiData = response.data.data;

          // Dựa vào dữ liệu từ API, cập nhật state `chartData`
          const updatedChartData = [
            {
              id: "post",
              value: apiData.totalPostDisplay,
              label: "Posts",
            },
            {
              id: "user",
              value: apiData.totalUser,
              label: "Users",
            },
            {
              id: "pet",
              value: apiData.totalPet,
              label: "Pets",
            },
            {
              id: "postDelete",
              value: apiData.totalPostDelete,
              label: "Post deleted",
            },
          ];

          setChartData(updatedChartData);
          console.log(updatedChartData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [token]);

  return (
    <div style={{ height: "600px" }}>
      {/* Đảm bảo bạn đặt kích thước cho biểu đồ */}
      <ResponsivePie
        data={chartData}
        keys={["value"]}
        indexBy="label"
        theme={{
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
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={true}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "post-dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 0, 0, 0.3)", // Màu cho "post"
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "user-dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(0, 255, 0, 0.3)", // Màu cho "user"
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "pet-dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(0, 0, 255, 0.3)", // Màu cho "pet"
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "post-lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 0, 0, 0.3)", // Màu cho "post"
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
          {
            id: "user-lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(0, 255, 0, 0.3)", // Màu cho "user"
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
          {
            id: "pet-lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(0, 0, 255, 0.3)", // Màu cho "pet"
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default PieChart;
