import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/Slices/userSlice';
import TextField from '@mui/material/TextField';
import { login } from "../../api/Produits";
import { Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#bdbdbd',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: '2px',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
    '& input': {
      padding: '12px 14px',
    },
  },
};

export default function SignIn(props) {
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState('');
  const [OF, setOf] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('error'); // 'success' | 'error' | 'warning' | 'info'


  const handleLogin = async () => {
    setLoading(true);
    try {
      const formattedData = { username, password };
      const result = await login(formattedData, 'login');

      if (result.success) {
        const decoded = JSON.parse(atob(result.token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify(decoded));
        dispatch(setUser(decoded));
        navigate('/');
      } else {
        setSnackbarMessage(result.message || 'Erreur de connexion');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);

      }
    } catch (err) {
      console.error('Erreur réseau ou serveur:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            align="center"
            color='#1976d2'
          >
            Sign in
          </Typography>



          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          >
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={inputStyle}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputStyle}
            />

            <LoadingButton
              fullWidth
              variant="contained"
              onClick={handleLogin}
              loading={loading}
              sx={{ mt: 3 }}
            >
              Se connecter
            </LoadingButton>

          </Box>
        </Card>
      </SignInContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  );
}
