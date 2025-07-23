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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const UpdateUser = ({ open, handleClose, onUpdate, userData }) => {
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.user.user)
    const [showPassword, setShowPassword] = useState(false);


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

    const handleCancel = () => {
        setUpdatedData({
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
            <DialogTitle align="center">Modifier un utilisateur</DialogTitle>
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
                            type={showPassword ? "text" : "password"}
                            value={updatedData.password || ""}
                            onChange={(e) => handleChange("password", e.target.value)}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Grid>



                    {updatedData.role !== "admin" && (<>
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
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label="Mois"
                                value={updatedData.mois || ""}
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


                    </>)}

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
                    Enregistrer
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateUser;
