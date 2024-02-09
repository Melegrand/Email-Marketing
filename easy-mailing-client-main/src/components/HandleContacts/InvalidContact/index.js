import './index.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import account from '../../../auth/utils';
import * as dotenv from 'dotenv';
import HeaderSection from '../../HeaderSection';
dotenv.config();

const InvalidContact = () => {
    const navigate = useNavigate();
    // Je récupère l'id de campagne et ele nom du fichier dans l'url
    const { idCampaign, nameFile } = useParams();
    // State qui gère ma liste de contacts invalides
    const [data, setData] = useState([]);
    // Je définis le title de ma page
    document.title = 'Contacts invalides'

    useEffect(() => {
        // fonction qui ajoute le fichier et actualise le sate isAdded si il n'y a pas d'erreurs
        async function getInvalidContact() {
            try {
                const response = await fetch(`${process.env.URL_API}/api/${idCampaign}/${nameFile}/invalidContact`, account.fetchOptionsGet());
                const dataContacts = await response.json();
                setData(dataContacts);
            } catch (error) {
                console.error(error);
                navigate('/404');
            }
        }
        getInvalidContact()
    }, []);
    
    return (
        <section className="section">
            <HeaderSection 
                route={`/liste/detail/${idCampaign}/contacts`} 
                title={'Liste contacts invalides'} 
                ariaLabel={"Retour page liste des campagnes"}
            />
            <div className="tableContainer subsection">
                <table role="présentation">
                    <caption>Liste des contacts invalides dans le fichier : {nameFile}</caption>
                    <thead>
                        <tr>
                            <th scope="col">Civility</th>
                            <th scope="col">Nom de famille</th>
                            <th scope="col">Prénom</th>
                            <th scope="col">Email</th>
                            <th scope="col">Entreprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((contact, index) => (
                            <tr key={index}>
                                <td>{contact.civility}</td>
                                <td>{contact.lastname}</td>
                                <td>{contact.firstname}</td>
                                <td>{contact.email}</td>
                                <td>{contact.business}</td>
                            </tr>
                        )) : <tr>
                                <td colSpan="5" className='empty'>Aucun contact</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
export default InvalidContact;