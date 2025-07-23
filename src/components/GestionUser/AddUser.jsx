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
import { useSelector } from "react-redux";


const AddUser = ({ open, handleClose, onAdd }) => {

    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.user.user)



    const [newData, setNewData] = useState({
        id: "",
        username: "",
        password: "",
        role: "",
        Approved: "",
        mois: ""
    });

    const [error, setError] = useState(null);

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
                username: "",
                password: "",
                role: "",
                Approved: "",
                mois: ""
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    const handleCancel = () => {
        setNewData({
            id: "",
            username: "",
            password: "",
            role: "",
            Approved: "",
            mois: ""
        });
        handleClose();
    };

    const roleOptions = ["admin", "agent"];
    const approvedOptions = ["yes", "no"];

    const moisOptions = [
        { value: 1, label: "Janvier" },
        { value: 2, label: "Février" },
        { value: 3, label: "Mars" },
        { value: 4, label: "Avril" },
        { value: 5, label: "Mai" },
        { value: 6, label: "Juin" },
        { value: 7, label: "Juillet" },
        { value: 8, label: "Août" },
        { value: 9, label: "Septembre" },
        { value: 10, label: "Octobre" },
        { value: 11, label: "Novembre" },
        { value: 12, label: "Décembre" },
    ];


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{ "& .MuiDialog-paper": { width: "35%" } }}
        >

            <DialogTitle align="center">Ajouter un utilisateur</DialogTitle>
            <DialogContent sx={{ "&.MuiDialogContent-root": { paddingTop: "10px" } }}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <TextField
                            fullWidth
                            label="Username"
                            value={newData.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={newData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            variant="outlined"
                        />
                    </Grid>
                    {newData.role !== "admin" && (
                        <>
                            <Grid item>
                                <TextField
                                    select
                                    fullWidth
                                    label="Role"
                                    value={newData.role}
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
                                    value={newData.Approved}
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
                            <Grid item>
                                <TextField
                                    select
                                    fullWidth
                                    label="Mois"
                                    value={newData.mois}
                                    onChange={(e) => handleChange("mois", e.target.value)}
                                    variant="outlined"
                                >
                                    {moisOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                        </>
                    )}


                </Grid>
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

export default AddUser;
