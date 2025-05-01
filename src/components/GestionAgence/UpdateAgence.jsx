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


const UpdateAgence = ({ open, handleClose, agenceData, onUpdate }) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        DATE: "",
        Nom: "",
        CP: "",
        Commande: "",
        Livraison: "",
        Statut: "",
        Annulation: "",
        Agent: "",
        Total: "",
        Approved: "",
    });

    useEffect(() => {
        if (agenceData) {
            setFormData({ ...agenceData });
        }
    }, [agenceData]);

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
            await onUpdate(formData);
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        } finally {
            setLoading(false);
        }
    };


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
            <DialogTitle>Modifier l'agence</DialogTitle>
            <DialogContent>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                    <TextField
                        name="DATE"
                        label="DATE"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={convertToInputDate(formData.DATE)}
                        onChange={(e) => {
                            const converted = convertToDisplayDate(e.target.value);
                            const fakeEvent = {
                                target: {
                                    name: "DATE",
                                    value: converted,
                                },
                            };
                            handleChange(fakeEvent);
                        }}

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
                    <TextField
                        name="Livraison"
                        label="Livraison"
                        value={formData.Livraison || ""}
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
                    </TextField>
                    <TextField
                        name="Annulation"
                        label="Annulation"
                        value={formData.Annulation || ""}
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
                <Button onClick={handleClose} color="primary">
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

export default UpdateAgence;
