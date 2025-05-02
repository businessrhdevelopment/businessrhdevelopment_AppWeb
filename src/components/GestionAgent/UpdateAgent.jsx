import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";


const UpdateAgent = ({ open, handleClose, agentData, onUpdate }) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        DATE: "",
        Nom: "",
        CP: "",
        Commande: "",
        Livraison: "",
        Statut: "",
        Commentaire: "",
        Agent: "",
        Total: "",
        Approved: "",
    });

    useEffect(() => {
        if (agentData) {
            setFormData({ ...agentData });
        }
    }, [agentData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formattedDate = formatDateToDDMMYYYY(formData.DATE);
            const formattedLivraison = formatDateToDDMMYYYY(formData.Livraison); // Formatage de la date de livraison



            const updatedFormData = {
                ...formData,
                DATE: formattedDate,
                Livraison: formattedLivraison, // Ajout de la date de livraison formatée
            };

            await onUpdate(updatedFormData);
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        } finally {
            setLoading(false);
        }
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

      const handleCancel = () => {
        setFormData({
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





    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle align="center">Modifier la commande</DialogTitle>
            <DialogContent>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>


                    <TextField
                        name="DATE"
                        label="DATE"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.DATE}
                        onChange={handleChange}
                    />



                    <TextField
                        name="Nom"
                        label="Nom"
                        value={formData.Nom || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        name="CP"
                        label="CP"
                        value={formData.CP || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        name="Commande"
                        label="Commande"
                        value={formData.Commande || ""}
                        onChange={handleChange}
                    />
                    {/* <TextField
                        name="Livraison"
                        label="Livraison"
                        value={formData.Livraison || ""}
                        onChange={handleChange}
                    /> */}
                    <TextField
                        name="Livraison"
                        label="Livraison"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.Livraison}
                        onChange={handleChange}
                    />
                    <TextField
                        name="Statut"
                        label="Statut"
                        select
                        value={formData.Statut || ""}
                        onChange={handleChange}
                    >
                        <MenuItem value="Conf KO">Conf KO</MenuItem>
                        <MenuItem value="Injoignable">Injoignable</MenuItem>
                        <MenuItem value="Livraison">Livraison</MenuItem>
                        <MenuItem value="Livrée">Livrée</MenuItem>
                        <MenuItem value="Annulation à la livraison">Annulation à la livraison</MenuItem>
                    </TextField>
                    <TextField
                        name="Commentaire"
                        label="Commentaire"
                        value={formData.Commentaire || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        name="Agent"
                        label="Agent"
                        value={formData.Agent || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        name="Total"
                        label="Total"
                        type="number"
                        value={formData.Total || ""}
                        onChange={handleChange}
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
                    Enregistrer
                </LoadingButton>

            </DialogActions>
        </Dialog>
    );
};

export default UpdateAgent;
