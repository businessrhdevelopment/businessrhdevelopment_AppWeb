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

const AddAgence = ({ open, handleClose, onAdd }) => {
    const [newData, setNewData] = useState({
        id: "",
        DATE: "",
        Nom: "",
        CP: "",
        Commande: "",
        Livraison: "",
        Statut: "",
        Annulation: "",
        Agent: "",
        Total: ""
    });

    const [agentOptions, setAgentOptions] = useState([]);
    const statutOptions = ["Conf KO", "Injoignable", "Livraison", "Livrée"];
    const [loading, setLoading] = useState(false);


    // Chargement des usernames à l'ouverture du Dialog
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const users = await getData("user");
                const agences = users
                    .filter((user) => user.role === "agence" && user.Approved === "yes")
                    .map((user) => user.username);
                setAgentOptions(agences);
            } catch (error) {
                console.error("Erreur lors du chargement des agents :", error);
            }
        };

        if (open) {
            fetchAgents();
        }
    }, [open]);


    const handleChange = (field, value) => {
        setNewData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true); // Lancement du chargement
        try {
            const updatedData = { ...newData };
            await onAdd(updatedData); // attend que le parent finisse la requête
            handleClose();
            setNewData({
                id: "",
                DATE: "",
                Nom: "",
                CP: "",
                Commande: "",
                Livraison: "",
                Statut: "",
                Annulation: "",
                Agent: "",
                Total: ""
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        } finally {
            setLoading(false); // Fin du chargement
        }
    };
    

    // Convertit dd-mm-yyyy → yyyy-mm-dd (pour le champ input)
    const convertToInputDate = (dateStr) => {
        if (!dateStr) return "";
        const [dd, mm, yyyy] = dateStr.split("-");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Convertit yyyy-mm-dd → dd-mm-yyyy (au changement)
    const convertToDisplayDate = (isoDateStr) => {
        if (!isoDateStr) return "";
        const [yyyy, mm, dd] = isoDateStr.split("-");
        return `${dd}-${mm}-${yyyy}`;
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle align="center">Ajouter une agence</DialogTitle>
            <DialogContent sx={{ "&.MuiDialogContent-root": { paddingTop: "10px" } }}>
                                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                                <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={convertToInputDate(newData.DATE)}
                            onChange={(e) => handleChange("DATE", convertToDisplayDate(e.target.value))}
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
                        <TextField
                            fullWidth
                            label="Livraison"
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
                            label="Annulation"
                            value={newData.Annulation}
                            onChange={(e) => handleChange("Annulation", e.target.value)}
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
                <Button onClick={handleClose} color="secondary">
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

export default AddAgence;
