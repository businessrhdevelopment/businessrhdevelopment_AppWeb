import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Grid,
    MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const UpdateUser = ({ open, handleClose, onUpdate, userData }) => {
    const [loading, setLoading] = useState(false);
    
    const [updatedData, setUpdatedData] = useState({ ...userData });

    useEffect(() => {
        setUpdatedData({ ...userData });
    }, [userData]);

    const handleChange = (field, value) => {
        setUpdatedData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onUpdate(updatedData);
            handleClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = ["admin", "agence"];
    const approvedOptions = ["yes", "no"];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{ "& .MuiDialog-paper": { width: "35%" } }}
        >
            <DialogTitle>Modifier un utilisateur</DialogTitle>
            <DialogContent sx={{ "&.MuiDialogContent-root": { paddingTop: "10px" } }}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <TextField
                            fullWidth
                            label="Username"
                            value={updatedData.username || ""}
                            onChange={(e) => handleChange("username", e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={updatedData.password || ""}
                            onChange={(e) => handleChange("password", e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            value={updatedData.role || ""}
                            onChange={(e) => handleChange("role", e.target.value)}
                            variant="outlined"
                        >
                            {roleOptions.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            select
                            fullWidth
                            label="Approved"
                            value={updatedData.Approved || ""}
                            onChange={(e) => handleChange("Approved", e.target.value)}
                            variant="outlined"
                        >
                            {approvedOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
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
                    Enregistrer
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateUser;
