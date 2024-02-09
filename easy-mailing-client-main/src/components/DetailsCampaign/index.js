import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.scss';
import dateFormat from "dateformat"
import HeaderSection from '../HeaderSection';
import account from '../../auth/utils';
import numberDays from '../numberDays';
import * as dotenv from 'dotenv';
dotenv.config();

const DetailsCampaign = ({fetchCampaignList}) => {
    // Ce state gère le détail d'une campagne
    const [detailsCampaign, setDetailsCampaign] = useState();
    // Ce state gère les informations de l'utilisateur
    const [user, setUser] = useState();
    // Ce state gère si il ya des contacts désinscrits dans les contacts enregistrés
    const [contactUnsubscribed, setContactUnsubscribed] = useState();
    // Ce useParams gère l'id de la campagne courrente
    const { currentId } = useParams();

    // fonction qui détermine le nombre de jours restants à la campagne
    remainingDay = numberDays(detailsCampaign?.endCampaign);

    // Fonction pour récupérer les informations d'une campagne venant de l'api
    const fetchCampaignDetails = async () => {
        const response = await fetch(`${process.env.URL_API}/api/campaignDetail/${currentId}`, account.fetchOptionsGet());
        const data = await response.json();
        setDetailsCampaign(data);
    }

    useEffect(() => {
        fetchCampaignList()
    }, [])

    // Fonction pour récupérer les informations d'un utilisateur venant de l'api
    const fetchUser = async () => {
        const response = await fetch(`${process.env.URL_API}/api/listUser`, account.fetchOptionsGet());
        const data = await response.json();
        data.map((item) => {
            if (item.email === detailsCampaign?.creatorEmail) {
                setUser(item);
            }
        })
    }

    // Fonction qu récupère les contacts désinscrits
    const listContactUnsubscribed = async () => {
        const response = await fetch(`${process.env.URL_API}/api/contactListUnsuscribed/${currentId}`, account.fetchOptionsGet());
        const data = await response.json();
        setContactUnsubscribed(data.length);
    }

    // Ce useEffect se déclenche au chargement du composant pour appeler la fonction pour récupérer les informations d'une campagne
    useEffect(() => {
        fetchCampaignDetails();
        listContactUnsubscribed();
    }, [])

    document.title = `Détail de la campagne ${detailsCampaign?.nameCampaign}`

    // Ce useEffect se déclenche quand le state detailsCampaign change d'état, pour appeler la fonction pour récupérer les informations d'un utilisateur
    useEffect(() => {
        fetchUser();
    }, [detailsCampaign])

    return (
        <section className="section">
            <HeaderSection route={"/liste"} title={'Détail ' + detailsCampaign?.nameCampaign} ariaLabel={"Retour page liste des campagnes"}/>
            <div className="subsection">
                <h2 className='important warning msg-warning'>&#9888; Pensez à valider une campagnes avant sa date d'envoi programmée, sinon celle-ci sera décalée jusqu'à ce qu'elle soit complète. (La date de début sur le calendrier changera au moment de la validation si celle-ci a été décalée).</h2>
                <ul className="section__main">
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Nom de la campagne <span>:</span></p>
                        <p className="section__main__paragraph">{detailsCampaign?.nameCampaign}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Sujet <span>:</span></p>
                        <p className="section__main__paragraph">{detailsCampaign?.subjectCampaign}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Email du créateur<span>:</span></p>
                        <p className="section__main__paragraph">{detailsCampaign?.creatorEmail}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Nom du créateur<span>:</span></p>
                        <p className="section__main__paragraph">{user?.lastname} {user?.firstname}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Date du début <span>:</span></p>
                        <p className="section__main__paragraph">{dateFormat(detailsCampaign?.startCampaign, "dd/mm/yyyy")}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Date de fin <span>:</span></p>
                        <p className="section__main__paragraph">{dateFormat(detailsCampaign?.endCampaign, "dd/mm/yyyy")}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Nombre de contacts programmés<span>:</span></p>
                        <p className="section__main__paragraph">{detailsCampaign?.nbrContact}</p>
                    </li>
                    {contactUnsubscribed > 0 && <li className="section__main__container">
                        <p className="section__main__paragraph">Contacts non programmés car désinscrits<span>:</span></p>
                        <p className="section__main__paragraph">{contactUnsubscribed}</p>
                    </li>}
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Mailing créer <span>:</span></p>
                        <p className="section__main__paragraph">{detailsCampaign?.mailing ? "Oui" : "Non"}</p>
                    </li>
                    <li className="section__main__container">
                        <p className="section__main__paragraph">Statut <span>:</span></p>
                        <p className="section__main__paragraph">
                            {detailsCampaign?.nbrContact === 0 && !detailsCampaign?.mailing ? "En attente de contact et de création de mailing" : ""}
                            {detailsCampaign?.nbrContact === 0 && detailsCampaign?.mailing ? "En attente de contact" : ""}
                            {detailsCampaign?.nbrContact > 0 && !detailsCampaign?.mailing ? "En attente de création de mailing" : ""}
                            {detailsCampaign?.nbrContact > 0 && detailsCampaign?.mailing && !detailsCampaign?.sent && !detailsCampaign?.full ? `En attente de validation pour l'envoi en programmation` : ""}
                            {detailsCampaign?.nbrContact > 0 && detailsCampaign?.mailing && detailsCampaign?.full ? `Programmé, envoi le ${dateFormat(detailsCampaign?.startCampaign, "dd/mm/yyyy")}` : ""}
                            {detailsCampaign?.nbrContact > 0 && detailsCampaign?.mailing && detailsCampaign?.sent ? `${remainingDay >= 0 ? remainingDay > 1 ? `En cours (${remainingDay} jours restants)` : `En cours (${remainingDay} jour restant)` : "Terminée"}` : ""}
                        </p>
                    </li>
                    <div className="section__main__linkContainer">
                        {/* <a href="/" className="section__main__linkContainer__link">Suivi statistiques</a> */}
                        {!detailsCampaign?.sent && !detailsCampaign?.mailing && <Link to={`/liste/detail/${currentId}/creationMailing`} className="section__main__linkContainer__link button">Créer mailing</Link>}
                        {detailsCampaign?.mailing && <Link to={`/liste/detail/${currentId}/verifierMailing`} className="section__main__linkContainer__link button">Vérifier mailing</Link>}
                        {detailsCampaign?.mailing && !detailsCampaign?.sent && <Link to={`/liste/detail/${currentId}/creationMailing`} className="section__main__linkContainer__link button">Modifier mailing</Link>}
                        {!detailsCampaign?.sent && <Link to={`/liste/detail/${currentId}/contacts`} className="section__main__linkContainer__link button">Gérer contacts</Link>}
                        {detailsCampaign?.sent && <Link to={`/liste/detail/${currentId}/statistic`} className="section__main__linkContainer__link button">Statistiques</Link>}
                    </div>
                </ul>
            </div>
        </section>
    )
}

export default DetailsCampaign;