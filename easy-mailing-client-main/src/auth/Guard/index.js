import { Navigate } from "react-router-dom"
import account from "../utils";

const Guard = ({ children }) => {
  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  if (!account.isLogged()) {
    return <Navigate to="/" />
  }
  // Sinon on permet de renvoyer les enfants du composant Guard
  return children;
}
export default Guard;