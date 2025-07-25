import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, IconButton, InputLabel, Select, FormControl, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import UpdateAgent from "./UpdateAgent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { getData, update, add, deletee, excelImport } from "../../api/Produits";
import AddAgent from "./AddAgent";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const GestionAgent = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);

    const [error, setError] = useState(null);
    const [selectedStatut, setSelectedStatut] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [selectedCP, setSelectedCP] = useState("");

    const [searchText, setSearchText] = useState("");

    const [open, setOpen] = useState(false); // Pour AddAgent
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null); // Contient id + usernamename
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('error'); // 'success' | 'error' | 'warning' | 'info'






    const user = useSelector(state => state.user.user)
    const role = useSelector(state => state.user.role)

    const [fileName, setFileName] = useState("");




    const filteredData = useMemo(() => {
        return (data || []).filter((row) => {  // <-- Add null check
            const statutValue = row["Statut"] ? row["Statut"].toString().toLowerCase() : "";
            const agentValue = row["Agent"] ? row["Agent"].toString().toLowerCase() : "";
            const cpValue = row["CP"] ? row["CP"].toString().toLowerCase() : "";

            const selectedStatutValue = selectedStatut ? selectedStatut.toString().toLowerCase() : "";
            const selectedAgentValue = selectedAgent ? selectedAgent.toString().toLowerCase() : "";
            const selectedCPValue = selectedCP ? selectedCP.toString().toLowerCase() : "";

            const matchesStatut = selectedStatutValue ? statutValue === selectedStatutValue : true;
            const matchesAgent = selectedAgentValue ? agentValue === selectedAgentValue : true;
            const matchesCP = selectedCPValue ? cpValue === selectedCPValue : true;

            return matchesStatut && matchesAgent && matchesCP;
        });
    }, [data, selectedStatut, selectedAgent, selectedCP]);


    const agentList = useMemo(() => {
        const uniqueAgents = new Set(data.map(row => row.Agent).filter(Boolean));
        return Array.from(uniqueAgents);
    }, [data]);

    const cpList = useMemo(() => {
        const uniqueCPs = new Set(data.map(row => row.CP).filter(Boolean));
        return Array.from(uniqueCPs);
    }, [data]);


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getData("agent", user.username);
            console.log("Données récupérées:", result);

            if (!result) return;

            // Si l'utilisateur est "agent", filtrer les résultats selon son username
            if (user?.role === "agent") {
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
            const result = await update(updatedRow, 'agent', user.username);
            if (result.success) {
                getData('agent', user.username).then(setData);  // Rafraîchir les données
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
            console.log("Nouvelle ligne à ajouter:", newRow);
            const result = await add(newRow, 'agent', user.username);
            if (result.success) {
                const updatedData = await getData('agent', user.username);
                setData(updatedData);
                setOpenDialog(false);
            } else {
                setSnackbarMessage(result.message || 'Erreur de connexion');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
        catch (error) {
            console.error("Erreur lors de l'ajout:", error);
        }
    };

    const handleDelete = (id) => {
        setAgentToDelete({ id });
        setDeleteDialogOpen(true);
    };


    const handleConfirmDelete = async () => {
        setDeleteLoading(true);

        if (!agentToDelete) return;
        try {
            const result = await deletee(agentToDelete, 'agent', user.username);
            if (result.success) {
                const updatedData = data.filter((item) => item.id !== agentToDelete.id);
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
            setAgentToDelete(null);
        }
    };




    const convertToInputDate = (dateStr) => {
        if (!dateStr) return "";
        const [dd, mm, yyyy] = dateStr.split("-");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Importer un fichier Excel et envoyer les données
    const handleFileUpload = (event) => {
        setLoading1(true);

        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();

        // Détection du type de fichier pour lecture adaptée
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        reader.onload = async (e) => {
            try {
                const fileContent = e.target?.result;

                let workbook;

                if (fileExtension === "csv") {
                    // Lecture CSV directe
                    workbook = XLSX.read(fileContent, { type: "string" });
                } else {
                    // Lecture XLSX/XLS en binaire
                    workbook = XLSX.read(fileContent, { type: "binary" });
                }

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // Supposons que la 1ère ligne (data[0]) contient les en-têtes
                const formattedData = data.slice(1)
                    .map((row) => ({
                        "id": row[0]?.toString().trim() || "",
                        "DATE": formatDate(row[1]),
                        "Nom": row[2] || "",
                        "CP": row[3] || "",
                        "Commande": row[4] || "",
                        "Livraison": formatDate(row[5]),
                        "Statut": row[6] || "",
                        "Commentaire": row[7]?.toString().trim() || "",
                        "Agent": row[8] || "",
                        "Total": row[9] || ""
                    }))
                    .filter(row => {
                        // Vérifie si au moins une cellule est non vide
                        return Object.values(row).some(value => value !== "");
                    });



                console.log(formattedData);

                // Envoi vers backend désactivé pour le moment
                const result = await excelImport(formattedData, 'agent', user.username);
                if (result.success) {
                    getData('agent', user.username).then(setData);
                    alert(result.message);
                } else {
                    console.error("Erreur:", result.message);
                }

            } catch (error) {
                console.error("Erreur lors de l'import:", error);
            } finally {
                setLoading1(false);
            }

            event.target.value = "";
            setFileName("");
        };

        // Déclenche le bon type de lecture
        if (fileExtension === "csv") {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    const formatDate = (excelDate) => {
        if (!excelDate) return "";
        let date;

        if (typeof excelDate === "number") {
            // Conversion depuis date Excel (numérique)
            date = XLSX.SSF.parse_date_code(excelDate);
            if (!date) return "";
            return `${String(date.d).padStart(2, '0')}-${String(date.m).padStart(2, '0')}-${date.y}`;
        }

        try {
            date = new Date(excelDate);
            if (isNaN(date)) return "";
            return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        } catch {
            return "";
        }
    };


    // Ajoutez cette fonction près de vos imports
    const exportToExcel = (data, fileName = 'export_agents') => {
        // Créer un nouveau workbook
        const wb = XLSX.utils.book_new();

        // Préparer les données pour l'export
        const exportData = data.map(row => ({
            ID: row.id,
            Date: row.DATE,
            Nom: row.Nom,
            'Code Postal': row.CP,
            Commande: row.Commande,
            Livraison: row.Livraison,
            Statut: row.Statut,
            Commentaire: row.Commentaire,
            Agent: row.Agent,
            Total: row.Total
        }));

        // Créer une worksheet à partir des données
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Ajouter la worksheet au workbook
        XLSX.utils.book_append_sheet(wb, ws, "Agents");

        // Générer le fichier Excel et le télécharger
        XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // const exportToExcel = (data, fileName = 'export_agents') => {
    //     const now = new Date();
    //     const currentMonth = now.getMonth(); // 0-indexed (0 = Janvier)
    //     const currentYear = now.getFullYear();

    //     // Filtrer les données du mois et année actuels
    //     const filteredData = data.filter(row => {
    //         if (!row.DATE) return false;
    //         const [day, month, year] = row.DATE.split('-').map(Number);
    //         return (month - 1 === currentMonth) && (year === currentYear);
    //     });

    //     // Préparer les données pour l'export
    //     const exportData = filteredData.map(row => ({
    //         ID: row.id,
    //         Date: row.DATE,
    //         Nom: row.Nom,
    //         'Code Postal': row.CP,
    //         Commande: row.Commande,
    //         Livraison: row.Livraison,
    //         Statut: row.Statut,
    //         Commentaire: row.Commentaire,
    //         Agent: row.Agent,
    //         Total: row.Total
    //     }));

    //     // Créer un nouveau workbook
    //     const wb = XLSX.utils.book_new();
    //     const ws = XLSX.utils.json_to_sheet(exportData);
    //     XLSX.utils.book_append_sheet(wb, ws, "Agents");

    //     // Générer le fichier Excel et le télécharger
    //     XLSX.writeFile(wb, `${fileName}_${now.toISOString().slice(0, 10)}.xlsx`);
    // };




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
                        <Typography variant="h5" fontWeight="bold">Gestion des agents</Typography>

                        <Box display="flex" gap={2}>
                            {(user.role === "admin") && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={() => setOpen(true)}
                                    >
                                        Ajouter une commande
                                    </Button>

                                    <LoadingButton
                                        component="label"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CloudUploadIcon />}
                                        loading={loading1}
                                    >
                                        Importer un fichier Excel
                                        <input type="file" accept=".xls,.xlsx,.csv" hidden onChange={handleFileUpload} />
                                    </LoadingButton>

                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => exportToExcel(filteredData, 'agents_export')}
                                        startIcon={<CloudDownloadIcon />}
                                    >
                                        Exporter en Excel
                                    </Button>

                                </>

                            )

                            }






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
                            <MenuItem value="Annulation à la livraison">Annulation à la livraison</MenuItem>
                            <MenuItem value="Injoignable à la livraison">Injoignable à la livraison</MenuItem>
                            
                            {/* Ajouter d'autres rôles si nécessaire */}
                        </TextField>

                        <TextField
                            fullWidth
                            select
                            label="Code Postal"
                            value={selectedCP}
                            onChange={(e) => setSelectedCP(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            {cpList.map((cp, idx) => (
                                <MenuItem key={idx} value={cp}>
                                    {cp}
                                </MenuItem>
                            ))}
                        </TextField>


                        {/* <TextField
                            fullWidth
                            label="Recherche"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Tapez un mot-clé..."
                        /> */}
                        {user.role === "admin" && (
                            <TextField
                                fullWidth
                                select
                                label="Agent"
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                            >
                                <MenuItem value="">Tous</MenuItem>
                                {agentList.map((agentName, idx) => (
                                    <MenuItem key={idx} value={agentName}>
                                        {agentName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}



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
                                            {["id", "DATE", "Nom", "CP", "Commande", "Livraison", "Statut", "Commentaire", "Agent", "Total"]
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

                                                <TableCell>{row.Commentaire}</TableCell>
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

                    {/* AddAgent Dialog */}
                    <AddAgent open={open} handleClose={() => setOpen(false)} onAdd={handleAdd} />
                    {selectedRow && (
                        <UpdateAgent
                            open={openDialog}
                            handleClose={() => setOpenDialog(false)}
                            agentData={{
                                ...selectedRow,
                                DATE: convertToInputDate(selectedRow?.DATE),
                                Livraison: convertToInputDate(selectedRow?.Livraison),
                            }}
                            onUpdate={handleUpdate}
                        />

                    )}



                    {/* Boîte de dialogue de confirmation */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirmation de suppression</DialogTitle>
                        <DialogContent>
                            <Typography>Voulez-vous vraiment supprimer la commande <strong>{agentToDelete?.id}</strong> ?</Typography>
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

export default GestionAgent;





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
        case "Annulation à la livraison":
            return { backgroundColor: "#FFE4E4", color: "#B42318", padding: "4px 10px", borderRadius: "10px" };
        case "Injoignable à la livraison":
            return { backgroundColor: "#E0D7FF", color: "#6941C6", padding: "4px 10px", borderRadius: "10px" };
        default:
            return {};
    }
};



// const filteredData = useMemo(() => {
//     return data.filter((row) => {
//         const statutValue = row["Statut"] ? row["Statut"].toString().toLowerCase() : "";
//         const selectedStatutValue = selectedStatut ? selectedStatut.toString().toLowerCase() : "";

//         // Vérifie si le statut correspond au filtre sélectionné, sinon ignore ce critère
//         const matchesStatut = selectedStatutValue ? statutValue === selectedStatutValue : true;

//         // Vérifie si n'importe quelle colonne contient le texte de recherche
//         const matchesSearch = searchText
//             ? Object.values(row).some(value => value.toString().toLowerCase().includes(searchText.toLowerCase()))
//             : true;

//         return matchesStatut && matchesSearch;
//     });
// }, [data, selectedStatut, searchText]);