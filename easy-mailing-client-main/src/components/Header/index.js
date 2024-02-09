import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import './burger.scss';
import account from "../../auth/utils";

const Header = ({location, handleChangeLocation, listCampaign, user, setUser}) => {
  // Ce state gère pour l'accessibilité si le menu est déplié ou non en version menu burger.
  // const [menuIsExpanded, setMenuIsExpanded] = useState(false)
  // const [closed, setClosed] = useState(true)

  // // Fonction qui permet d'avoir la taille d'écran et de repasser à false la state de dépliement si on est en version desktop
  // const getScreenSize = () => {
  //   let screenSize = window.innerWidth;
  //   if (screenSize > 1000) {
  //     setMenuIsExpanded(false)
  //     setClosed(true)
  //   }
  // }

  const logout = async () => {
    setUser(false);
    account.logout();
  }

  // Ecouteur d'évènemments sur la fenêtre à chaque redimensionnement de la fenêtre appel de la fonction getScreenSize
  // window.addEventListener('resize', getScreenSize)

  return (
    <header className='header' role="banner">
      <Link to="#main" className="evitement">Passer directement au contenu principal</Link>
      <nav role="navigation" aria-label="Menu principal" className="header__navigation">
        {/* <button className={closed ? "navigation__container__burger burgerIcon is-closed" : "navigation__container__burger burgerIcon is-opened"} id="burgerIcon" onClick={burgerClic}>
			    <span class="span"></span>
        </button> */}
        <Link onClick={handleChangeLocation} to="/" className="header__navigation__title">
          {location === '/' && <h1 className='header__navigation__title__element'>UnivInfo</h1>}
          {location !== '/' && <span className='header__navigation__title__element'>UnivInfo</span>}
        </Link>
        <ul className={"header__navigation__container"}>
          {/* <div className="navigation__container__list"> */}
            <li className="navigation__container__list__element">
              <Link onClick={handleChangeLocation} aria-current={location === '/' ? 'page' : null} to="/" className={location === '/' ? "navigation__container__list__element__link currentPage" : "navigation__container__list__element__link"}>Accueil</Link>
            </li>
            {user && 
              <>
                <li className="navigation__container__list__element">
                  <Link onClick={handleChangeLocation} aria-current={location === '/creation' ? 'page' : null} to="/creation" className={location === '/creation' ? "navigation__container__list__element__link currentPage" : "navigation__container__list__element__link"}>Création de campagne</Link>
                </li>
                <li className="navigation__container__list__element">
                  <Link onClick={handleChangeLocation} aria-current={location === '/liste' ? 'page' : null} to="/liste" className={location === '/liste' ? "navigation__container__list__element__link currentPage" : "navigation__container__list__element__link"}>Liste des campagnes ({listCampaign.length > 0 ? listCampaign.length : 0})</Link>
                </li>
                <li className="navigation__container__list__element">
                  <Link onClick={logout} to='/' className="navigation__container__list__element__link">Déconnexion</Link>
                </li>
              </>
            }
          {/* </div> */}
        </ul>
      </nav>
    </header>
  );
}
export default Header;