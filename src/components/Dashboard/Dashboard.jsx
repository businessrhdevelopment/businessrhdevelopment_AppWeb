import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { getData } from "../../api/Produits";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const taskStatesFixed = ["Conf KO", "Injoignable", "Livraison", "Livrée"];
const backgroundColors = ["red", "#FAAD14", "#1890FF", "#18794E"];
const hoverColors = ["red", "#FAAD14", "#1890FF", "#18794E"];

const Dashboard = () => {
  const [agenceData, setAgenceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.user.user)
  



const loadData = async () => {
  setLoading(true);
  try {
    const result = await getData("agenceSttus");

    if (user.role === "agence") {
      const filtered = result.filter(item => item.username === user.username);
      setAgenceData(filtered);
    } else {
      setAgenceData(result); // Pour admin
    }

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <CircularProgress
        size={80}
        sx={{ marginLeft: "48%", marginTop: "20%" }}
      />
    );
  }

  if (error) return <p>Erreur : {error}</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        padding: 4,
      }}
    >
{agenceData.map((agence, index) => {
  const { username, ...statusCounts } = agence;
  const taskStates = Object.keys(statusCounts);
  const doughnutData = {
    labels: taskStatesFixed,
    datasets: [
      {
        data: taskStatesFixed.map((state) => statusCounts[state] || 0),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
      },
    ],
  };
  

  return (
    <Box
      key={index}
      sx={{
        position: "relative",
        width: 300,
        height: 300,
        textAlign: "center",
      }}
    >
      <h4>{username}</h4>
      <Doughnut
        data={doughnutData}
        options={{
          cutout: "70%",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                boxWidth: 12,
                font: { size: 14 },
              },
            },
            datalabels: {
              color: "white",
              anchor: "center",
              align: "center",
              font: {
                size: 18,
                weight: "bold",
              },
              formatter: (value) => (value > 0 ? value : ""),
            },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: "bold",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          color: "black",
        }}
      >
        {Object.values(statusCounts).reduce((sum, val) => sum + val, 0)}
      </Box>
    </Box>
  );
})}

    </Box>
  );
  
};

export default Dashboard;
