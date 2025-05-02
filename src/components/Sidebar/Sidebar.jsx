import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactsIcon from '@mui/icons-material/Contacts';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Importer useNavigate
import logo from "../../assets/images/logo.png"; // Importation du logo
import { ExitToApp } from '@mui/icons-material';
import { logout } from "../../redux/Slices/userSlice"; 
import { useDispatch, useSelector } from "react-redux";
import { loogout } from "../../api/Produits";
import BusinessIcon from '@mui/icons-material/Business'; // Pour agents
import GroupIcon from '@mui/icons-material/Group'; // Pour utilisateurs
import { LoadingButton } from "@mui/lab";




const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Obtenir l'URL actuelle
  const dispatch = useDispatch(); // ✅ Initialisation de Redux Dispatch
  const [open, setOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);




  const user = useSelector(state => state.user.user)

      // Fonction pour gérer l'ouverture et la fermeture de la boîte de dialogue
      const handleClickOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);


  const [isCollapsed, setIsCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("isCollapsed")) || false;
  });

  // Fonction pour basculer la sidebar entre large et réduite
  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("isCollapsed", JSON.stringify(newState));
      return newState;
    });
  };



  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Gestion des agents", icon: <BusinessIcon />, path: "/gestion-agent" },
    // N'affiche "Gestion des utilisateurs" que si le rôle n'est pas "agent"
    ...(user?.role !== "agent"
      ? [{ text: "Gestion des utilisateurs", icon: <GroupIcon />, path: "/gestion-user" }]
      : [])
  ];
  

  // Synchronisation de l'index en fonction du path

  const getSelectedIndex = () => {
    const index = menuItems.findIndex(item => item.path === location.pathname);
    return index !== -1 ? index : 0; // Par défaut, sélectionner Dashboard si le chemin n'est pas trouvé
  };

  const [selectedIndex, setSelectedIndex] = useState(getSelectedIndex);

  // Met à jour selectedIndex à chaque changement de l'URL
  useEffect(() => {
    setSelectedIndex(getSelectedIndex());
  }, [location.pathname]);


 

  const handleConfirmLogout = async () => {
    setOpen(false);
    dispatch(logout());
    navigate("/login");

  };


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 60 : 208,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? 60 : 208,
          bgcolor: "black",
          color: "white",
          transition: "width 0.3s ease-in-out",
        },
      }}
    >
      <Box sx={{ p: 1, textAlign: "center", cursor: "pointer" }} onClick={toggleSidebar}>
        <img src={logo} alt="Logo" style={{ width: isCollapsed ? "40px" : "70px"  }} />
      </Box>



      <List sx={{ width: "100%" }}>
        {menuItems.map(({ text, icon, path }, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => navigate(path)}
              sx={{
                "&:hover": { color: "rgb(26,117,211)", svg: { color: "rgb(26,117,211)" } },
                "&.Mui-selected": { color: "rgb(26,117,211)" },
                "& .MuiListItemIcon-root": { color: selectedIndex === index ? "rgb(26,117,211)" : "white" },
                "& .css-cokf1l-MuiListItemIcon-root" :{ minWidth: "40px"},
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: "auto", width: "100%" }}>
                <ListItem disablePadding sx={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-start" }}>
                    <ListItemButton
                        selected={selectedIndex === -1}
                        onClick={handleClickOpen} // Ouvre le dialogue
                        sx={{
                            minWidth: "100%",
                            "&:hover": { color: "rgb(26,117,211)", svg: { color: "rgb(26,117,211)" } },
                            "&.Mui-selected": { color: "rgb(26,117,211)" },
                            "& .MuiListItemIcon-root": { color: selectedIndex === -1 ? "rgb(26,117,211)" : "white" },
                            "& .MuiTypography-root": { fontSize: "12px", display: isCollapsed ? "none" : "block" },
                            "& .css-cokf1l-MuiListItemIcon-root": { minWidth: "40px" },
                        }}
                    >
                        <ListItemIcon><ExitToApp /></ListItemIcon>
                        {!isCollapsed && <ListItemText primary="Déconnexion" />}
                    </ListItemButton>
                </ListItem>
            </Box>

            {/* Boîte de dialogue de confirmation */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Voulez-vous vraiment vous déconnecter ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Non</Button>
                    <Button onClick={handleConfirmLogout} color="error" autoFocus>Oui</Button>
                </DialogActions>
            </Dialog>

    </Drawer>
  );
};

export default Sidebar;

