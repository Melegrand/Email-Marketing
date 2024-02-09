import { Link } from 'react-router-dom';
import numberDays from '../../numberDays';

const Campaign = ({currentId, nameCampaign, sent, endDate, full}) => {
    // fonction qui détermine le nombre de jours restants à la campagne
    remainingDay = numberDays(endDate);

    return (
        <Link to={`/liste/detail/${currentId}`} className="section__main__list__link" aria-label={'Gérer la campagne ' + nameCampaign}>
            <li className="section__main__list__container">
                <div className="section__main__list__container__paragraph">
                    <p>{nameCampaign}</p>
                    <p>{sent ? `${remainingDay >= 0 ? remainingDay > 1 ? `En cours (${remainingDay} jours restants)` : `En cours (${remainingDay} jour restant)` : "Terminée"}` : full ? "Envoi programmé" : "A compléter"}</p>
                </div>
                <span className="section__main__list__container__more" aria-label={'Gérer la campagne ' + nameCampaign}>&#x279C;</span>
            </li>
        </Link>
    );
    
}

export default Campaign;
