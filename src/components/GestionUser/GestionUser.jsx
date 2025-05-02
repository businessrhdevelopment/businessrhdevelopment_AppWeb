import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, IconButton, InputLabel, Select, FormControl, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UpdateUser from "./UpdateUser";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { getData, update, add, deletee } from "../../api/Produits";
import AddUser from "./AddUser";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const GestionUser = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedApproved, setSelectedApproved] = useState("");
    const [open, setOpen] = useState(false); // Pour AddUser
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // Contient id + username
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('error'); // 'success' | 'error' | 'warning' | 'info'




    const user = useSelector(state => state.user.user)

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const roleValue = row["role"] ? row["role"].toString().toLowerCase() : "";
            const approvedValue = row["Approved"] ? row["Approved"].toString().toLowerCase() : "";
            const selectedRoleValue = selectedRole ? selectedRole.toString().toLowerCase() : "";
            const selectedApprovedValue = selectedApproved ? selectedApproved.toString().toLowerCase() : "";

            const matchesRole = selectedRoleValue ? roleValue === selectedRoleValue : true;
            const matchesApproved = selectedApprovedValue ? approvedValue === selectedApprovedValue : true;

            return matchesRole && matchesApproved;
        });
    }, [data, selectedRole, selectedApproved]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getData("user",user.username);
            console.log("Data fetched:", result);
            if (!result) return;

            setData(result);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async (updatedRow) => {
        try {
            const result = await update(updatedRow, 'user',user.username);
            if (result.success) {
                getData('user',user.username).then(setData);  // Rafraîchir les données
                setOpenDialog(false);
            } else {
                setSnackbarMessage(result.message || 'Erreur de connexion');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    const handleAdd = async (updatedRow) => {
        try {
            const newRow = { ...updatedRow }; // Attribution automatique de l'id
            const result = await add(newRow, 'user',user.username);
            console.log("result", result); // Debugging line
            if (result.success) {
                const updatedData = await getData('user',user.username);
                setData(updatedData);
                setOpenDialog(false);
            } else {
                setSnackbarMessage(result.message || 'Erreur de connexion');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);            }
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
        }
    };

    const handleDelete = (id, username) => {
        setUserToDelete({ id, username });
        setDeleteDialogOpen(true);
    };


    const handleConfirmDelete = async () => {
        setDeleteLoading(true);

        if (!userToDelete) return;

        try {
            const result = await deletee(userToDelete, 'user',user.username);
            if (result.success) {
                const updatedData = data.filter((item) => item.id !== userToDelete.id);
                setData(updatedData);
            } else {
                setSnackbarMessage(result.message || 'Erreur de connexion');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);

            }
        } catch (error) {
            console.error("Erreur réseau lors de la suppression:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };




    


    const [tableHeight, setTableHeight] = useState("80vh");

    useEffect(() => {
        const updateHeight = () => {
            const windowHeight = window.innerHeight;
            let newHeight = "80vh";
            if (windowHeight <= 953 && windowHeight > 738.6) {
                newHeight = "72vh";
            } else if (windowHeight <= 738.6 && windowHeight > 593.33) {
                newHeight = "65vh";
            } else if (windowHeight <= 593.33 && windowHeight > 491.73) {
                newHeight = "58vh";
            } else if (windowHeight <= 491.73) {
                newHeight = "52vh";
            }
            setTableHeight(newHeight);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);


    return (
        <Box sx={{ display: "flex", height: "100%", bgcolor: "#f4f4f4", overflow: "hidden" }}>
            <Box sx={{ display: "flex", margin: "auto", bgcolor: "#fff", width: "100%", height: "100%", borderRadius: "8px", overflow: "hidden", m: 1 }}>
                <Box sx={{ width: "100%", margin: "auto", mt: 4, pl: 1, pr: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight="bold">Gestion des utilisateurs</Typography>
                        <Box display="flex" gap={2}>

                        {(user.role === "admin") && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => setOpen(true)}
                            >
                                Ajouter un utilisateur
                            </Button>
                        )}

        </Box>
                    </Box>

                    <Box display="flex" gap={2} mb={2}>
                        <TextField
                            fullWidth
                            select
                            label="Rôle"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="agent">Agent</MenuItem>
                            {/* Ajouter d'autres rôles si nécessaire */}
                        </TextField>

                        <TextField
                            fullWidth
                            select
                            label="Approuvé"
                            value={selectedApproved}
                            onChange={(e) => setSelectedApproved(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="yes">yes</MenuItem>
                            <MenuItem value="no">no</MenuItem>
                        </TextField>
                    </Box>

                    {loading ? (
                        <CircularProgress size={80} sx={{ marginLeft: "48%", marginTop: "18%", width: "auto", height: "auto" }} />
                    ) : error ? (
                        <Typography variant="body1" sx={{ textAlign: "center", mt: 2, color: "red" }}>{error}</Typography>
                    ) : (
                        <Box>
                            <TableContainer component={Paper} sx={{ maxHeight: tableHeight, overflowY: "auto" }}>
                                <Table stickyHeader>
                                    <TableHead sx={{
                                        backgroundColor: "#000", height: "50px", whiteSpace: "nowrap",
                                        overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px",
                                    }}>
                                        <TableRow>
                                            {["id", "username", "password", "role", "Approved", "action"].map(header => (
                                                <TableCell key={header} sx={{ color: "#fff", fontWeight: "bold", position: "sticky", top: 0, backgroundColor: "#000", zIndex: 10 }}>
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.username}</TableCell>
                                                <TableCell>{row.password}</TableCell>
                                                <TableCell >{row.role}</TableCell>
                                                <TableCell>
                                                    <span style={getRoleStyle(row.Approved)}>{row.Approved}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        sx={{ color: "#1976d2" }}
                                                        onClick={() => {
                                                            setSelectedRow(row);
                                                            setOpenDialog(true);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>

                                                    {row.role !== "admin" && (
                                                    <IconButton
                                                        sx={{ color: "#d32f2f" }}
                                                        onClick={() => handleDelete(row.id, row.username)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>)}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* AddUser Dialog */}
                    <AddUser open={open} handleClose={() => setOpen(false)} onAdd={handleAdd} />
                    {selectedRow && (
                        <UpdateUser
                            open={openDialog}
                            handleClose={() => setOpenDialog(false)}
                            userData={selectedRow}
                            onUpdate={handleUpdate}
                        />
                    )}
                    {/* Boîte de dialogue de confirmation */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirmation de suppression</DialogTitle>
                        <DialogContent>
                            <Typography>Voulez-vous vraiment supprimer l'utilisateur <strong>{userToDelete?.username}</strong> ?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Annuler</Button>
                            <LoadingButton
                                onClick={handleConfirmDelete}
                                color="error"
                                autoFocus
                                loading={deleteLoading}
                                variant="contained"
                            >
                                Supprimer
                            </LoadingButton>

                        </DialogActions>
                    </Dialog>

                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default GestionUser;





const getRoleStyle = (status) => {
    if (typeof status !== "string") {
        return {};
    }

    const trimmedStatus = status.trim();
    if (trimmedStatus === "En cours") {
        return { backgroundColor: "#FFE084", color: "#F3A61C", padding: "4px 10px", borderRadius: "10px" };
    } else if (trimmedStatus === "yes") {
        return { backgroundColor: "#D1FADF", color: "#18794E", padding: "4px 10px", borderRadius: "10px" };
    } else if (trimmedStatus === "pas démarré") {
        return { backgroundColor: "#D0E7FF", color: "#0056B3", padding: "4px 10px", borderRadius: "10px" };
    } else if (trimmedStatus === "na") {
        return { backgroundColor: "#E0E0E0", color: "#9E9E9E", padding: "4px 10px", borderRadius: "10px" };
    } else if (trimmedStatus === "no") {
        return { backgroundColor: "#FCD7E3", color: "#B42318", padding: "4px 10px", borderRadius: "10px" };
    }

    return {};
};
