import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Grid,
    MenuItem,
    Box
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { getData } from "../../api/Produits"; // <-- ajuste le chemin si nécessaire
import { useSelector } from "react-redux";

const AddAgent = ({ open, handleClose, onAdd }) => {
    const [newData, setNewData] = useState({
        id: "",
        DATE: "",
        Nom: "",
        CP: "",
        Commande: "",
        Livraison: "",
        Statut: "",
        Commentaire: "",
        Agent: "",
        Total: ""
    });

    const [agentOptions, setAgentOptions] = useState([]);
    const statutOptions = ["Conf KO", "Injoignable", "Livraison", "Livrée", "Annulation à la livraison"];
    const [loading, setLoading] = useState(false);

        const user = useSelector(state => state.user.user)
    

    // Chargement des usernames à l'ouverture du Dialog
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const users = await getData("user",user.username);
                const agents = users
                    .filter((user) => user.role === "agent" && user.Approved === "yes")
                    .map((user) => user.username);
                setAgentOptions(agents);
            } catch (error) {
                console.error("Erreur lors du chargement des agents :", error);
            }
        };

        if (open) {
            fetchAgents();
        }
    }, [open,fetchAgents]);


    const handleChange = (field, value) => {
        setNewData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formattedDate = formatDateToDDMMYYYY(newData.DATE);
            const formattedLivraison = formatDateToDDMMYYYY(newData.Livraison); // Formatage de la date de livraison


            const updatedData = {
                ...newData,
                DATE: formattedDate, // remplace avec la version dd-mm-yyyy
                Livraison: formattedLivraison, // remplace avec la version dd-mm-yyyy
            };

            await onAdd(updatedData);
            handleClose();
            setNewData({
                id: "",
                DATE: "",
                Nom: "",
                CP: "",
                Commande: "",
                Livraison: "",
                Statut: "",
                Commentaire: "",
                Agent: "",
                Total: ""
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setNewData({
            id: "",
            DATE: "",
            Nom: "",
            CP: "",
            Commande: "",
            Livraison: "",
            Statut: "",
            Commentaire: "",
            Agent: "",
            Total: ""
        });
        handleClose();
    };
    
    function formatDateToDDMMYYYY(input) {
        if (!input) return "";
      
        // Supporte un objet Date ou une string ISO
        const date = new Date(input);
        if (isNaN(date.getTime())) return ""; // gestion des dates invalides
      
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
      
        return `${dd}-${mm}-${yyyy}`;
      }
      




    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle align="center">Ajouter une commande</DialogTitle>
            <DialogContent sx={{ "&.MuiDialogContent-root": { paddingTop: "10px" } }}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                    <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newData.DATE}
                        onChange={(e) => handleChange("DATE", e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Nom"
                        value={newData.Nom}
                        onChange={(e) => handleChange("Nom", e.target.value)}
                        variant="outlined"
                    />

                    <TextField
                        fullWidth
                        label="CP"
                        value={newData.CP}
                        onChange={(e) => handleChange("CP", e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Commande"
                        value={newData.Commande}
                        onChange={(e) => handleChange("Commande", e.target.value)}
                        variant="outlined"
                    />
                    {/* <TextField
                        fullWidth
                        label="Livraison"
                        value={newData.Livraison}
                        onChange={(e) => handleChange("Livraison", e.target.value)}
                        variant="outlined"
                    /> */}
                    <TextField
                        fullWidth
                        label="Livraison"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newData.Livraison}
                        onChange={(e) => handleChange("Livraison", e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        select
                        fullWidth
                        label="Statut"
                        value={newData.Statut}
                        onChange={(e) => handleChange("Statut", e.target.value)}
                        variant="outlined"
                    >
                        {statutOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Commentaire"
                        value={newData.Commentaire}
                        onChange={(e) => handleChange("Commentaire", e.target.value)}
                        variant="outlined"
                    />

                    <TextField
                        select
                        fullWidth
                        label="Agent"
                        value={newData.Agent}
                        onChange={(e) => handleChange("Agent", e.target.value)}
                        variant="outlined"
                    >
                        {agentOptions.map((agent) => (
                            <MenuItem key={agent} value={agent}>
                                {agent}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Total"
                        type="number"
                        value={newData.Total}
                        onChange={(e) => handleChange("Total", e.target.value)}
                        variant="outlined"
                    />


                </Box>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Annuler
                </Button>
                <LoadingButton
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    loading={loading}
                >
                    Ajouter
                </LoadingButton>

            </DialogActions>
        </Dialog>
    );
};

export default AddAgent;
