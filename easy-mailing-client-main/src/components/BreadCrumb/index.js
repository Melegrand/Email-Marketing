import { Link, useLocation } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import './index.scss'; 

// Définition des routes et de leurs miettes de pain associées
const routes = [
    { path: '/', breadcrumb: 'Accueil' },
    { path: '/signup', breadcrumb: 'inscription' },
    { path: '/creation', breadcrumb: 'création de campagne' },
    { path: '/liste', breadcrumb: 'liste des campagnes' }, 
    { path: '/liste/detail', breadcrumb: null },
    { path: '/liste/detail/:currentId', breadcrumb: 'détail' },
    { path: '/liste/detail/:id/creationMailing', breadcrumb: 'création du mailling' },
    { path: '/liste/detail/:currentId/statistic', breadcrumb: 'statistiques' },
    { path: '/liste/detail/:currentId/verifierMailing', breadcrumb: 'vérifier le mailling' },
    { path: '/liste/detail/:idCampaign/contacts', breadcrumb: 'contact' },
    { path: '/liste/detail/:currentId/contacts/creationContact', breadcrumb: 'création de contact' },
    { path: '/liste/detail/:currentId/contacts/invalidContact/', breadcrumb: null },
    { path: '/liste/detail/:currentId/contacts/invalidContact/:nameFile', breadcrumb: 'contacts invalides' }
];

function Breadcrumbs({handleChangeLocation}) {
    // Obtient l'emplacement actuel de la navigation
    const location = useLocation();
  
    // Génère le breadcrumbs fonction des routes
    const breadcrumbs = useBreadcrumbs(routes);
    return (
      <nav className='breadcrumbs' role= "navigation" aria-label="Fil d'Ariane">
            <ol className='breadcrumbs__list'>
                {/* Boucle sur le breadcrumbs */}
                {breadcrumbs.map(({ match, breadcrumb }, index) => { 
                    if (location.pathname != '/') {
                        return (
                            <li className='breadcrumbs__list__element' key={index}>
                                {/* détermine s'il faut afficher le caractère '>'  */}
                                <span className='breadcrumbs__list__link'>{index > 0 && breadcrumb && '>'}</span>
                                {breadcrumb && (
                                    <Link
                                    to={match.pathname}
                                    // J'attribue la classe active si l'URL correspond à la route actuelle
                                    className={
                                        location.pathname === match.pathname
                                        ? 'breadcrumb-active'
                                        : 'breadcrumb-not-active'
                                    }
                                    // Je définis l'aria-current si l'URL correspond à la route actuelle
                                    aria-current={location.pathname === match.pathname ? "page" : null}
                                    onClick={handleChangeLocation}
                                    >
                                    {breadcrumb}
                                    </Link>
                                )}
                            </li>
                        );
                    }
                })}
            </ol>
      </nav>
    );
}

export default Breadcrumbs;
