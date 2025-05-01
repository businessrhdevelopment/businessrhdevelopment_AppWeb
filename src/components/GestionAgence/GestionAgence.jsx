import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, IconButton, InputLabel, Select, FormControl, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UpdateAgence from "./UpdateAgence";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { getData, update, add, deletee } from "../../api/Produits";
import AddAgence from "./AddAgence";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const GestionAgence = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatut, setSelectedStatut] = useState("");
    const [selectedApproved, setSelectedApproved] = useState("");
    const [searchText, setSearchText] = useState("");

    const [open, setOpen] = useState(false); // Pour AddAgence
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [agenceToDelete, setAgenceToDelete] = useState(null); // Contient id + usernamename
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('error'); // 'success' | 'error' | 'warning' | 'info'





    const user = useSelector(state => state.user.user)

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const statutValue = row["Statut"] ? row["Statut"].toString().toLowerCase() : "";
            const selectedStatutValue = selectedStatut ? selectedStatut.toString().toLowerCase() : "";

            // Vérifie si le statut correspond au filtre sélectionné, sinon ignore ce critère
            const matchesStatut = selectedStatutValue ? statutValue === selectedStatutValue : true;

            // Vérifie si n'importe quelle colonne contient le texte de recherche
            const matchesSearch = searchText
                ? Object.values(row).some(value => value.toString().toLowerCase().includes(searchText.toLowerCase()))
                : true;

            return matchesStatut && matchesSearch;
        });
    }, [data, selectedStatut, searchText]);



    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getData("agence");
            console.log("Data fetched:", result);

            // Si l'utilisateur est "agence", filtrer les résultats selon son username
            if (user?.role === "agence") {
                const filtered = result.filter(item => item.Agent === user.username);
                setData(filtered);
            } else {
                setData(result);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [user]);





    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async (updatedRow) => {
        try {
            const result = await update(updatedRow, 'agence');
            if (result.success) {
                getData('agence').then(setData);  // Rafraîchir les données
                setOpenDialog(false);
            } else {
                setSnackbarMessage(result.message || 'Erreur de connexion');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);

            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    const handleAdd = async (updatedRow) => {
        try {
            const newRow = { ...updatedRow }; // Attribution automatique de l'id
            const result = await add(newRow, 'agence');
            console.log("result", result); // Debugging line
            if (result.success) {
                const updatedData = await getData('agence');
                setData(updatedData);
                setOpenDialog(false);
            } else {
                setSnackbarMessage(result.message || 'Erreur de connexion');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
        }
    };

    const handleDelete = (id) => {
        setAgenceToDelete({ id });
        setDeleteDialogOpen(true);
    };


    const handleConfirmDelete = async () => {
        setDeleteLoading(true);

        if (!agenceToDelete) return;

        try {
            const result = await deletee(agenceToDelete, 'agence');
            if (result.success) {
                const updatedData = data.filter((item) => item.id !== agenceToDelete.id);
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
            setAgenceToDelete(null);
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Agences");

        // Générer un fichier Excel et le télécharger
        XLSX.writeFile(workbook, "agences_export.xlsx");
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
                        <Typography variant="h5" fontWeight="bold">Gestion des agences</Typography>

                        <Box display="flex" gap={2}>
                            {(user.role === "admin") && (

                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() => setOpen(true)}
                                >
                                    Ajouter une commande
                                </Button>)}

                            <Button
                                variant="outlined"
                                color="success"
                                onClick={handleExportExcel}
                            >
                                Exporter Excel
                            </Button>
                        </Box>

                    </Box>

                    <Box display="flex" gap={2} mb={2}>
                        <TextField
                            fullWidth
                            select
                            label="Statut"
                            value={selectedStatut}
                            onChange={(e) => setSelectedStatut(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="Conf KO">Conf KO</MenuItem>
                            <MenuItem value="Injoignable">Injoignable</MenuItem>
                            <MenuItem value="Livraison">Livraison</MenuItem>
                            <MenuItem value="Livrée">Livrée </MenuItem>
                            {/* Ajouter d'autres rôles si nécessaire */}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Recherche par statut"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Tapez un mot-clé..."
                        />

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
                                            {["id", "DATE", "Nom", "CP", "Commande", "Livraison", "Statut", "Annulation", "Agent", "Total"]
                                                .map(header => (
                                                    <TableCell key={header} sx={{ color: "#fff", fontWeight: "bold", position: "sticky", top: 0, backgroundColor: "#000", zIndex: 10 }}>
                                                        {header}
                                                    </TableCell>
                                                ))
                                            }
                                            {user.role === "admin" && (
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold", position: "sticky", top: 0, backgroundColor: "#000", zIndex: 10 }}>
                                                    action
                                                </TableCell>
                                            )}

                                        </TableRow>

                                    </TableHead>
                                    <TableBody>
                                        {filteredData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.DATE}</TableCell>
                                                <TableCell>{row.Nom}</TableCell>
                                                <TableCell>{row.CP}</TableCell>
                                                <TableCell>{row.Commande}</TableCell>
                                                <TableCell>{row.Livraison}</TableCell>
                                                <TableCell>
                                                    <span style={getStatusStyle(row.Statut)}>{row.Statut}</span>
                                                </TableCell>

                                                <TableCell>{row.Annulation}</TableCell>
                                                <TableCell>{row.Agent}</TableCell>
                                                <TableCell>{row.Total}</TableCell>
                                                {user.role === "admin" && (
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
                                                        <IconButton
                                                            sx={{ color: "#d32f2f" }}
                                                            onClick={() => handleDelete(row.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                )}


                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* AddAgence Dialog */}
                    <AddAgence open={open} handleClose={() => setOpen(false)} onAdd={handleAdd} />
                    {selectedRow && (
                        <UpdateAgence
                            open={openDialog}
                            handleClose={() => setOpenDialog(false)}
                            agenceData={selectedRow}
                            onUpdate={handleUpdate}
                        />
                    )}
                    {/* Boîte de dialogue de confirmation */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirmation de suppression</DialogTitle>
                        <DialogContent>
                            <Typography>Voulez-vous vraiment supprimer la commande <strong>{agenceToDelete?.id}</strong> ?</Typography>
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

export default GestionAgence;





const getStatusStyle = (status) => {
    if (typeof status !== "string") {
        return {};
    }

    const trimmedStatus = status.trim();
    switch (trimmedStatus) {
        case "Conf KO":
            return { backgroundColor: "#FCD7E3", color: "#B42318", padding: "4px 10px", borderRadius: "10px" };
        case "Injoignable":
            return { backgroundColor: "#FFE084", color: "#F3A61C", padding: "4px 10px", borderRadius: "10px" };
        case "Livraison":
            return { backgroundColor: "#D0E7FF", color: "#0056B3", padding: "4px 10px", borderRadius: "10px" };
        case "Livrée":
            return { backgroundColor: "#D1FADF", color: "#18794E", padding: "4px 10px", borderRadius: "10px" };
        default:
            return {};
    }
};

