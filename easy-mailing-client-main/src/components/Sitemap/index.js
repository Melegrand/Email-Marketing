import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import account from "../../auth/utils";
import HeaderSection from "../HeaderSection";
const Sitemap = ({location, handleChangeLocation, listCampaign, setUser}) => {
    // Title de la page
    document.title = 'Plan du site'

    // Fonction qui permet la déconnexion
    const logout = async () => {
        setUser(false);
        account.logout();
    }

    useEffect(() => {
        handleChangeLocation()
    }, [])

    return (
        <section className="section">
            <HeaderSection route={`/`} title={"Plan du site"} ariaLabel={"Retour accueil"}/>
            <nav role="navigation" aria-label="Plan du site" className="section__nav subsection">
                <ul className="section__nav__container">
                    <li className="section__nav__container__element"><Link onClick={handleChangeLocation} to="/" className={"section__nav__container__element__link"} aria-label="Page d'accueil">Accueil</Link></li>
                    <li className="section__nav__container__element"><Link onClick={handleChangeLocation} to="/creation" className={"section__nav__container__element__link"} aria-label='Créer une nouvelle campagne'>Création de campagne</Link></li>
                    <li className="section__nav__container__element"><Link onClick={handleChangeLocation} to="/liste" className={"section__nav__container__element__link"} aria-label='Affiche la liste des campagnes'>Liste de campagnes ({listCampaign?.length})</Link></li>
                    <li className="section__nav__container__element"><Link onClick={logout} to='/' className="section__nav__container__element__link" aria-label='Se deconnecter et revenir à la page de connexion'>Se déconnecter</Link></li>
                    <li className="section__nav__container__element"><Link onClick={handleChangeLocation} to='/plan' className={"section__nav__container__element__link"} aria-label='Plan du site'>Plan du site</Link></li>
                </ul>
            </nav>
        </section>
    );
}

export default Sitemap;