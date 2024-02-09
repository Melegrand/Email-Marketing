import './index.scss';
import Campaign from './Campaign';
import HeaderSection from '../HeaderSection';
import { useEffect, useState, useRef } from 'react';
import Pagination from '../Pagination';

const ListCampaign =  ({ listCampaign, fetchCampaignList, getLocation }) => {
    // State qui gère si la recherche des filtres ont changés
    const [change, setChange] = useState(false);
    // State qui gère la liste de campagnes à faire apparaitre
    const [filteredListCampaign, setFilteredListCampaign] = useState(listCampaign);
    // State qui gère la recherche par nom 
    const [search, setSearch] = useState("");
    // State qui gère la recherche par année
    const [year, setYear] = useState('');
        // State qui gère la recherche par mois
    const [month, setMonth] = useState('');
    // State qui gère l'orde de tri par année croissante ou non
    const [order, setOrder] = useState('desc');
    // State qui gère si il y a une erreur de format dans la date de mois
    const [errorMonth, setErrorMonth] = useState(false);
    // State qui gère si il y a manque l'année
    const [errorMonthWithoutYear, setErrorMonthWithoutYear] = useState(false);
    // State qui gère si il y a une erreur dans le format de date d'année
    const [errorYear, setErrorYear] = useState(false);
    // State qui gère la page actuelle de la pagination
    const [currentPage, setCurrentPage] = useState(1);
    // State qui gère le nombre d'éléments par page
    const [itemsPerPage, setItemsPerPage] = useState(10); 

    // Calcul de l'indice de départ pour les éléments actuellement affichés sur la page
    const startIndex = (currentPage - 1) * itemsPerPage;
    // Calcul de l'indice de fin pour les éléments actuellement affichés sur la page
    const endIndex = startIndex + itemsPerPage;
    // Extraction des campagnes actuellement affichées sur la page en fonction des indices de départ et de fin
    const currentCampaigns = filteredListCampaign?.slice(startIndex, endIndex);

    // Refs sur les champs de filtre en erreur 
    const yearInputRef = useRef(null);
    const monthInputRef = useRef(null);

    document.title = 'Liste des campagnes'

    // Fonction qui gère à chaque changement de l'input l'actualisation du state de recherche
    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    // Fonction qui gère à chaque changement de l'input l'actualisation du state d'année
    const handleYear = (e) => {
        setYear(e.target.value.toLowerCase()); 
    };
    
    // Fonction qui gère à chaque changement de l'input l'actualisation du state de mois
    const handleMonth = (e) => {
        setMonth(e.target.value) 
    };

    // Fonction qui gère à chaque changement du select l'actualisation de tri par année croissanteou non
    const handleOrder = (e) => {
        setOrder(e.target.value);
    };

    // Fonction qui gère la validation des filtres , j'actualise mon state de changement.
    // Ce qui va rappeler mon useffect car change lui est passé comme dépendance
    const handleValidateFilters = (e) =>{
        e.preventDefault();
        setChange(change ? false : true)
    }

    // Fonction qui gère le reset des filtres , j'actualise mon state de changement. (si il y avait une erreur, je repasse à false)
    const handleResetFilters= () => {
        setErrorMonth(false)
        setErrorYear(false)
        setErrorMonthWithoutYear(false)
        setSearch('')
        setYear('');
        setMonth('')
        setOrder('desc');
        setChange(change ? false : true)
    }

    // fonction qui gère l'application des filtres 
    const applyFilters = () => {
        // Regex qui définit un format année
        const yearRegex = /^\d{4}$/;
        // Regex qui définit un format mois
        const monthRegex = /^(0[1-9]|1[0-2])$/

        // variables qui définissent si oui ou non il y a une erreur dans l'année ou le mois
        let yearTest = true ;
        let monthTest = true ;

        // Je remets mes erreurs à false avant de vérifier si il y a des erreurs
        setErrorMonth(false)
        setErrorYear(false)
        setErrorMonthWithoutYear(false)

        // Si l'utilisateur a mis une année
        if (year) {      
            // Si ce qu'il a rentré n'est pas valide au format attendu
            if(!yearRegex.test(year)) {
                // alors je mets le state de test à false (sinon par defaut il reste à true)
                yearTest = false
            }
        }

        // Si l'utilisateur a mis un mois
        if (month) {
            // / Si ce qu'il a rentré n'est pas valide au format attendu ou qu'il n'a pas rempli l'année
            if(!monthRegex.test(month) || !year) {
                // alors je mets le state de test à false (sinon par defaut il reste à true)
                monthTest = false
            }
        }

        // Si mes deux tests sont bon (true), j'actionne mes filtres
        if(yearTest && monthTest) {
            // je filtre ma liste de campagnes 
            const filters = listCampaign
            // D'abord par nom
            .filter((campaign) => campaign.nameCampaign.toLowerCase().includes(search))
            // Puis par date
            .filter((campaign) => {
                // uniquement si il ya une année rentrée
                if (year) {
                    const start = new Date(campaign.startCampaign);
                    return start.getFullYear() === parseInt(year);
                } else {
                    return campaign
                }
            })
            // puis par mois
            .filter((campaign) => {
                // uniquement si il y a un mois de rentré
                if (month) {
                    const start = new Date(campaign.startCampaign);
                    return (start.getMonth() + 1).toString().padStart(2, '0') === month && start.getFullYear() === parseInt(year);
                } else {
                    return campaign
                }
            });
            
            // Et je classe mes résultats filtrés par ordre coissant ou non
            if (order === 'desc') {
                filters.sort((a, b) => (a.startCampaign < b.startCampaign ? 1 : -1));
            } else {
                filters.sort((a, b) => (a.startCampaign > b.startCampaign ? 1 : -1));
            }
            // je mets mon state de liste de campagnes filtrées à jour
            setFilteredListCampaign(filters);
        } else {
            // Sinon je mets une erreur pour l'année
            !yearTest && setErrorYear(true)
            
            // Et une erreur pour le mois si l'utilisateur a rentré un mois et que le format ne match pas
            if (month && !monthRegex.test(month)) {
                setErrorMonth(true)
            }

            // Et une erreur pour le mois si l'utilisateur n'a pas rentré d'année pour chercher le mois (car il faut savoir le mois de quelle année)
            if(!monthTest && !year && month) {
                setErrorMonthWithoutYear(true)
            }
        }
    }

    useEffect(() => {
        // Fonction qui récupère la liste de campagnes
        fetchCampaignList()
        // Fonction qui récupère où on est sur le site 
        getLocation()
    }, []);

    // useEffect qui gère la liste de campagnes filtrées, est rappelé à chaque changement du state change et de la liste de campagnes
    useEffect(() => {
        // J'applique mes filtres
        applyFilters()
        // Je remets sur la première page d'affichage
        setCurrentPage(1)
    }, [change, listCampaign]);


    // a la validation des filtres je remets le focus là où il y a une erreur au besoin
    useEffect(() => {
        if (errorYear) {
            yearInputRef.current.focus();
        } else if (errorMonthWithoutYear) {
            yearInputRef.current.focus();
        } else if(errorMonth) {
            monthInputRef.current.focus();
        }
    }, [errorYear, errorMonthWithoutYear, errorMonth, change]);
    
    console.log(filteredListCampaign)
    return (
        <section className="section">
            <HeaderSection route={"/"} title={"Liste des campagnes"} ariaLabel={"Retour accueil"}/>
            <div className="section__main subsection">
                <form className="section__main__search" onSubmit={handleValidateFilters}>
                    <p id="required" className='required section__main__search__required'>*Année obligatoire si recherche par mois</p>

                    <fieldset className="section__main__search__container">
                        <div className='section__main__search__container__form'>
                            <legend className='sr-only'>Filtres :</legend>
                            <div className="section__main__search__container__form__field">
                                <label htmlFor="search" id="search-label">Nom de campagne : </label>
                                <input role="search" type="search" value={search} name="search" id="search" onChange={handleSearch}/>
                            </div>
                            
                            <div className="section__main__search__container__form__field">
                                <label htmlFor="dateFilter" id="date-label">Dates :</label>
                                <select
                                    id="dateFilter"
                                    value={order}
                                    onChange={handleOrder}
                                >
                                    <option value="desc">Décroissantes</option>
                                    <option value="asc">Croissantes</option>
                                </select>
                            </div>

                            <div className='section__main__search__container__form__field'>
                                <label htmlFor="yearFilter" id="year-label"><span className='required'>*</span>Année :</label>
                                <input
                                    id="yearFilter"
                                    value={year}
                                    onChange={handleYear}
                                    type="search"
                                    placeholder="ex: 2023"
                                    aria-describedby={(errorYear && 'errorYear')||(errorMonthWithoutYear && 'errorMonthAndYear')||(!errorYear && !errorMonthWithoutYear && 'year')} 
                                    aria-invalid={errorYear || errorMonthWithoutYear ? true : null }
                                    ref={yearInputRef}
                                />
                                <span id="year" className='sr-only'>exemple : 2023</span>
                            </div>

                            <div className='section__main__search__container__form__field'>
                                <label htmlFor="monthFilter" id="month-label">Numéro de mois :</label>
                                <input
                                    type="search"
                                    id="monthFilter"
                                    value={month}
                                    onChange={handleMonth}
                                    placeholder="ex: 09"
                                    aria-describedby={errorMonth ? 'errorMonth' : 'month'}
                                    aria-invalid={errorMonth ? true : null }
                                    ref={monthInputRef}
                                />
                                <span id= "month" className='sr-only'>exemple : 09</span>
                            </div>
                        </div>

                        {/* Si il ya une erreur sur le format du mois, j'affiche ce message */}
                        {errorMonth && <p id='errorMonth' className="section__main__search__container__form__error important">Format de mois invalide, veuillez rentrer un mois valide entre "01" et "12" ou laisser le champs vide.</p>}
                        {/* Si il manquue l'année et que l'utilisateur cherche un mois, j'affiche ce message */}
                        {errorMonthWithoutYear && <p id='errorMonthAndYear' className="section__main__search__container__form__error important">Veuillez remplir l'année si vous cherchez un mois.</p>}
                        {/* Si il ya une erreur sur l'année, j'affiche ce message */}
                        {errorYear && <p id='errorYear' className="section__main__search__container__form__error important">Format d'année invalide, veuillez rentrer une année au format AAAA, exemple : 2023</p>}

                        <div className="section__main__search__container__action">
                            <button type="reset" onClick={handleResetFilters} className="section__main__search__container__action__reset">Réinitialiser les filtres</button>
                            <button type="submit" className="section__main__search__container__action__submit">Appliquer les filtres</button>
                        </div>
                    </fieldset>
                </form>
                <h2 className='important warning'>&#9888; Pensez à valider une campagnes avant sa date d'envoi programmée, sinon celle-ci sera décalée jusqu'à ce qu'elle soit complète. (La date de début sur le calendrier changera au moment de la validation si celle-ci a été décalée).</h2>
                {filteredListCampaign && <h2 className='section__main__result'>{filteredListCampaign.length} résultat{filteredListCampaign.length > 0 ? 's' : ''} </h2>}

                <ul className='section__main__list'>
                    {currentCampaigns?.map((data, index) => {
                        return (
                        <Campaign
                            key={index}
                            nameCampaign={data.nameCampaign}
                            currentId={data.id}
                            sent={data.sent}
                            endDate={data.endCampaign}
                            full={data.full}
                        />
                        );
                    })}
                </ul>
                <Pagination className='section__pagination'
                    totalItems={filteredListCampaign.length}
                    itemsPerPage={itemsPerPage} //nombre d'éléments par page
                    currentPage={currentPage} // état pour la page actuelle
                    onPageChange={setCurrentPage} //fonction pour mettre à jour la page actuelle
                />
            </div>
        </section>
    )
}

export default ListCampaign;