import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { getData } from "../../api/Produits";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const taskStatesFixed = ["Conf KO", "Injoignable", "Livraison", "Livrée","Annulation à la livraison"];
const backgroundColors = ["red", "#FAAD14", "#1890FF", "#18794E","#B42318"];
const hoverColors = ["red", "#FAAD14", "#1890FF", "#18794E","#B42318"];

const Dashboard = () => {
  const [agentData, setAgentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.user.user)




  const loadData = async () => {
    console.log("user",user)
    setLoading(true);
    try {
      const result = await getData("agentStatus", user.username);
      console.log("dashboard"+result);

      if (!result){
        setAgentData([]);
        return;
      } 
      if (user.role === "agent") {
        const filtered = result.filter(item => item.username === user.username);
        setAgentData(filtered);
      } else {
        setAgentData(result); // Pour admin
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

  if (error) return <Typography variant="body1" sx={{ textAlign: "center", mt: 2, color: "red" }}>{error}</Typography>;

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
      {agentData.map((agent, index) => {
        const { username, ...statusCounts } = agent;
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
              zIndex: 100,

            }}
          >
            <h4>{username}</h4>
            <div style={{ position: "relative", width: "100%", height: "100%", zIndex: "2" }}>

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
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label;
                        const value = statusCounts["€ " + label] || 0;
                        return `${label}: ${value.toLocaleString()} €`;
                      }
                    }
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
</div>
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
              {taskStatesFixed.reduce((sum, key) => sum + (statusCounts[key] || 0), 0)}
            </Box>
          </Box>
        );
      })}

    </Box>
  );

};

export default Dashboard;
