import store  from '../redux/store'; // import du store
import { logout } from '../redux/Slices/userSlice';

export const handleAuthFailure = (data) => {
  if (!data) return false;

  if (
    data.code === "TOKEN_EXPIRED" ||
    data.message === "Votre compte non approved" ||
    data.message === "Votre compte non existe"
  ) {
    store.dispatch(logout());
    window.location.href = "/login";
    return true;
  }
  return false;
};
