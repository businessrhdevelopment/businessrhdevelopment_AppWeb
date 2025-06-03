import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { getData } from "../../api/Produits";
import { Box, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const taskStatesFixed = ["Conf KO", "Injoignable", "Livraison", "Livrée", "Annulation à la livraison"];
const backgroundColors = ["red", "#FAAD14", "#1890FF", "#18794E", "#B42318"];
const hoverColors = ["red", "#FAAD14", "#1890FF", "#18794E", "#B42318"];

const Dashboard = () => {
  const [agentData, setAgentData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [allPeriods, setAllPeriods] = useState([]);
  const user = useSelector(state => state.user.user);

  const loadData = async () => {
    try {
      const endpoint = user.role === "admin" 
        ? "agentStatusAdmin" 
        : "agentStatus";

      const result = await getData(endpoint, user.username);
      console.log("Agent Status Data:", result);

      if (!result) {
        setAgentData([]);
        return;
      }

      // Filtrer pour les agents, garder tout pour les admins
      const filtered = user.role === "agent" 
        ? result.filter(item => item.username === user.username)
        : result;

      setAgentData(filtered);

      // Extraire toutes les périodes uniques
      const periods = [...new Set(filtered.map(item => item.period))]
        .sort((a, b) => b.localeCompare(a));
      
      setAllPeriods(periods);
      // Définir "Toutes périodes" comme valeur par défaut
      setSelectedPeriod(""); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Grouper les données par agent et période sélectionnée
  useEffect(() => {
    if (!agentData.length) {
      setGroupedData([]);
      return;
    }

    const grouped = {};
    
    agentData.forEach(item => {
      // Filtrer par période si une période spécifique est sélectionnée
      if (selectedPeriod && item.period !== selectedPeriod) return;
      
      const username = item.username;
      
      if (!grouped[username]) {
        grouped[username] = {
          username,
          period: selectedPeriod || "Toutes périodes",
          // Initialiser tous les compteurs à 0
          ...Object.fromEntries(taskStatesFixed.map(state => [state, 0])),
          ...Object.fromEntries(taskStatesFixed.map(state => [`€ ${state}`, 0]))
        };
      }

      // Somme des comptages et montants
      taskStatesFixed.forEach(state => {
        grouped[username][state] += item[state] || 0;
        grouped[username][`€ ${state}`] += item[`€ ${state}`] || 0;
      });
    });

    setGroupedData(Object.values(grouped));
  }, [agentData, selectedPeriod]);

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
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Sélecteur de période - uniquement pour les admins */}
      {user.role === "admin" && allPeriods.length > 0 && (
        <FormControl sx={{ minWidth: 200, mb: 4 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            label="Période"
          >
            <MenuItem value="">Toutes périodes</MenuItem>
            {allPeriods.map((period) => (
              <MenuItem key={period} value={period}>
                {period}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {groupedData.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Aucune donnée disponible
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            padding: 4,
          }}
        >
          {groupedData.map((agent, index) => {
            const { username, ...statusCounts } = agent;
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
                {user.role === "admin" && selectedPeriod && (
                  <Typography variant="subtitle2">
                    {agent.period}
                  </Typography>
                )}
                {user.role === "admin" && !selectedPeriod && (
                  <Typography variant="subtitle2">
                    Toutes périodes
                  </Typography>
                )}

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
                              const value = statusCounts[`€ ${label}`] || 0;
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
      )}
    </Box>
  );
};

export default Dashboard;