import HeaderSection from '../../HeaderSection';
import { useEffect, useState, useRef } from 'react';
import account from '../../../auth/utils';
import './index.scss';
import { useNavigate, useParams } from 'react-router-dom';
import * as dotenv from 'dotenv';
dotenv.config();

const AddContact = ({listCampaign}) => {
    const navigate = useNavigate();
    // Ce state gère les erreurs des champs vides
    const [errorEmpty, setErrorEmpty] = useState(false);
    // Ce state gère si il ya une rreur dans l'email
    const [errorMail, setErrorMail] = useState(false);
    // Ce state gère si le serveur renvoie une erreur
    const [errorServer, setErrorServer] = useState(false);
    // Ce state gère si l'utilisateur à tenter de valider la création du contact
    const [addContact, setAddContact] = useState(false);
    // State de l'objet campagne qui permet de gérer si elle a déjà été envoyée ou non
    const [campaign, setCampaign] = useState({sent: true});
    // Récupération de l'id de campagne en paramètre
    const {idCampaign} = useParams();

    // références des éléments html pour gérer le focus
    const civility = useRef(null)
    const lastName = useRef(null)
    const firstName = useRef(null)
    const email = useRef(null)
    const firstAdd= useRef(addContact)

    // Je mets par defaut mes champs à vide
    const [contact, setContact] = useState({
        civility: "",
        firstname: "",
        lastname: "",
        email: "",
        business: "",
        idCampaign: idCampaign
    });

    // Je définis le title de ma page
    document.title = `Ajout de contact ${
        errorEmpty
        || errorMail
        || errorServer ? 'erreur' : ''
    }`

    // hydrate l'objet du state avec les données rentrer dans le formulaire
    const handleChangeAddContact = (e) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value,
            idCampaign: idCampaign
        });
    }

    // Je remets mes champs à vide au reset 
    function handleReset() {
        setContact({
            civility: "",
            firstname: "",
            lastname: "",
            email: "",
            business: "",
            idCampaign: idCampaign
        })
        resetError()
    }

    // Fonction qui permet de reset les states d'erreur
    function resetError () {
        setErrorMail(false);
        setErrorEmpty(false);
        setErrorServer(false)
    }

    // Fonction qui au submit vérifie si tous les champs sont bon
    const submitAddContact = async (e) => {
        e.preventDefault();
        resetError()
        const regexMail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        // Si l'adresse mail est vide ou n'est pas valide je jette une erreur
        if (!regexMail.test(contact.email) && contact.email !== "") {
            setErrorMail(true)
        }

        if(contact.civility === "" || contact.civility === "--" || contact.firstname === "" || contact.lastname === "" || contact.email === "") {
            setErrorEmpty(true);
        }
        setAddContact(addContact ? false : true)
    }

    async function createContact () {
        try {
            if (!errorMail && !errorEmpty) {
                // Envoi des données vers la base de données si tout est ok
                const response = await fetch(`${process.env.URL_API}/api/addContact`, account.fetchOptionsPost(contact));

                if (!response.ok) {
                    throw new Error('La création n\'est pas ok');
                } else {
                    navigate(`/liste/detail/${idCampaign}/contacts`);
                }
            } 
        } catch (error) {
            setErrorServer(true)
        }
    }

    // au chargement de la page je récupère l'objet de la campagne en cours, ce qui permettra d'afficher le contenu ou non selon si la campagne est envoyée
    useEffect(() => {
        if (listCampaign && listCampaign.length > 0) {
            const campaignList = listCampaign.filter(campaign => campaign.id === parseInt(idCampaign));
            if (campaignList.length > 0) {
                setCampaign(campaignList[0]);
            }
        }
    }, [listCampaign]);

    // Si l'utilisateur a tenté de valider la création je passe dans mon useEffedct
    useEffect(() => {
        // Si la valeur de l'ajout est différente de la précédente alors j'appelle ma fonction de création de contact
        if (addContact !== firstAdd.current) {
            createContact();

            // Je redirige le focus sur le premier champs en erreur si il y en a
            if(contact.civility === ""){
                civility.current.focus();
            } else if (contact.lastname === ""){
                lastName.current.focus();
            } else if (contact.firstname === ""){
                firstName.current.focus();
            } else if (contact.email === "" || errorMail){
                email.current.focus();
            }
            firstAdd.current = addContact;
        }        
    }, [addContact]);

    return (
        <section className="section">
            <HeaderSection route={`/liste/detail/${idCampaign}/contacts`} title={"Ajouter un contact"} ariaLabel={"Retour page gestion des contacts"}/>
            {!campaign.sent ? 
                <form className="section__form subsection" onSubmit={submitAddContact}>
                    <fieldset className="section__form__fieldset">
                        <span className='section__form__fieldset__error important' aria-hidden="true">* Champs obligatoires</span>
                        <div className='section__form__fieldset__container__civility'>
                            <label htmlFor="civility">Civilité <span className="important" aria-hidden="true">*</span></label>
                            <select name="civility" id="civility" onChange={handleChangeAddContact} aria-required="true" ref={civility} aria-invalid={contact.civility === "" && errorEmpty ? true : false} aria-describedby={errorEmpty ? "errorEmpty" : ""}> 
                                <option value="--">--</option>
                                <option value="M.">M.</option>
                                <option value="Mme">Mme</option>
                            </select>
                        </div>
                        <label htmlFor="lastname" className="section__form__fieldset__label">Nom de famille <span className="important" aria-hidden="true">*</span></label>
                        <input 
                            type="text" 
                            className="section__form__fieldset__lastname" 
                            name="lastname" 
                            id="lastname" 
                            onChange={handleChangeAddContact} 
                            aria-required="true" ref={lastName} 
                            aria-invalid={contact.lastname === "" && errorEmpty ? true : false} 
                            aria-describedby={errorEmpty ? "errorEmpty" : ""}
                        />

                        <label htmlFor="firstname" className="section__form__fieldset__label">Prénom <span className="important" aria-hidden="true">*</span></label>
                        <input 
                            type="text" 
                            className="section__form__fieldset__firstname" 
                            name="firstname" 
                            id="firstname" 
                            onChange={handleChangeAddContact} 
                            aria-required="true" 
                            ref={firstName} 
                            aria-invalid={contact.firstname === "" && errorEmpty ? true : false} 
                            aria-describedby={errorEmpty ? "errorEmpty" : ""}
                        />

                        <label htmlFor="email" className="section__form__fieldset__label">Email (exemple@email.com)<span className="important" aria-hidden="true">*</span></label>
                        <input 
                            type="text" 
                            className="section__form__fieldset__email" 
                            name="email" id="email" 
                            onChange={handleChangeAddContact} 
                            aria-required="true" 
                            ref={email} 
                            aria-invalid={contact.email === "" && errorEmpty || errorMail ? true : false} 
                            aria-describedby={`${errorEmpty ? 'errorEmpty ' : ''}${errorMail ? 'errorMail ' : ''}${!errorMail && !errorEmpty && ''}`}
                        />
                        {errorMail &&<p className='section__form__fieldset__error important' id="errorMail">Erreur dans le format, format attendu exemple : email@example.com</p>}

                        <label htmlFor="business" className="section__form__fieldset__label">Entreprise</label>
                        <input type="text" name="business" id="business" onChange={handleChangeAddContact}/>

                        {errorEmpty && <p className='section__form__fieldset__error important' id="errorEmpty">Veuillez remplir tous les champs obligatoires.</p>}
                        {errorServer&& <p className='section__form__fieldset__error important' id="errorEmpty">Une erreur serveur est survenue, veuillez réessayer ultérieurement</p>}
                        <div className="section__form__fieldset__buttonContainer">
                            <button className="section__form__fieldset__buttonContainer__reset button" type="reset" onClick={handleReset}>Réinitialiser les champs</button>
                            <input type="submit" className="section__form__fieldset__buttonContainer__submit button" value="Ajouter" aria-label="Ajouter et retourner à la page de contacts"/>
                        </div>
                    </fieldset>
                </form> : <p>L'accès à cette page n'est pas autorisé si la campagne a été envoyée</p>
            }
        </section>
    )
}

export default AddContact;