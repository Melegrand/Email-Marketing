import { Link } from 'react-router-dom';
import './headerSection.scss';

const HeaderSection = ({ route, title, ariaLabel }) => {
    return (
        <section className="headerSection">
            <Link to={route} className="headerSection__link" aria-label={ariaLabel}><span className="arrowleft">←</span><span className="returnText">Retour</span></Link>
            <h1 className="headerSection__title">{title}</h1>
        </section>
    )
}

export default HeaderSection;