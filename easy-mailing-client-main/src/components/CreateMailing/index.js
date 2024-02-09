import './index.scss';
import { useEffect, useState, useRef } from 'react';
import HeaderSection from '../HeaderSection';
import { useNavigate, useParams } from 'react-router-dom';
import account from '../../auth/utils';
import * as dotenv from 'dotenv';
import validator from 'validator';

dotenv.config();

const createMailing = ( { listCampaign }) => {
    const navigate = useNavigate();
    const { idCampaign } = useParams();
    // State qui gère si il y a une erreur dans l'url rentrée
    const [errorUrl, setErrorUrl] =useState(false)
    // State qui gère si l'utilisateur a tenté de valider la campagne
    const [change, setChange] =useState(false)
    // State qui gère si il le texte est vide ou non
    const [emptyText, setEmptyText] = useState(false)
    // State qui gère si il le texte est trop long ou non
    const [tooLongText, setTooLongText] = useState(false)
    // State qui gère si l'utilisateur a validé le mailing
    const [isSubmit, setIsSubmit] = useState(false)
    // State de l'objet campagne qui permet de gérer si elle a déjà été envoyée ou non
    const [campaign, setCampaign] = useState({sent: true});
    // State qui gère si le serveur renvoie une erreur ou non
    const [errorServer, setErrorServer] = useState(false);

    // Je définis par défaut mes champs à vide
    let subjectCampaign = '';
    let textCampaign = '';
    let linkCampaign = '';

    // Je filtre mes campagnes pour affecter aux champs les valeurs existantes si il y en a
    listCampaign?.filter((campaign) => {
        if (campaign.id == idCampaign) {
            subjectCampaign = campaign.subjectCampaign;
            textCampaign = campaign.textCampaign;
            linkCampaign = campaign.linkCampaign;
        }
    })

    // State du contenu du mailing
    const [mailing, setMailing] = useState({
        text: textCampaign,
        idCampaign: idCampaign,
        link: linkCampaign
    });

    // Références aux éléments html pour gérer les focus
    const linkRef = useRef(null)
    const textRef = useRef(null)

    // Ajout du title de la page
    document.title = `Création du mailing ${
        errorUrl
        || emptyText
        || errorServer ? 'erreur' : ''
    }`

    // A chaque changement sur mes inputs je mets le state du mailing à jour
    const handleChangeMailing = (e) => {
        setMailing({
            ...mailing,
            [e.target.name]: e.target.value,
            idCampaign: idCampaign
        });
    }

    // au submit, je vérifie si tout est bon
    const handleSubmitMailing = async (e) => {
        e.preventDefault();
        // Je reset mes erreurs
        setErrorUrl(false)
        setEmptyText(false)
        setErrorServer(false)
        setTooLongText(false)

        // Si lien non vide et incorrecte alors je jette une erreur
        if(mailing.link !== "" && mailing.link !== null) {
            if(!validator.isURL(mailing.link)) {
                setErrorUrl(true)
            }
        }
        // Si texte vide alors je jette une erreur
        if(mailing.text === undefined || mailing.text === '') {
            setEmptyText(true)
        }

        if(mailing.text .length > 2500) {
            setTooLongText(true)
        }
        // J'actualise mes states de changements
        setIsSubmit(true)
        setChange(change ? false : true)
        // Envoi des données vers la base de données si tout est ok
       
    }

    useEffect(() => {
        // au chargement de la page je récupère l'objet de la campagne en cours, ce qui permettra d'afficher le contenu ou non selon si la campagne est envoyée
        if (listCampaign && listCampaign.length > 0) {
            const campaignList = listCampaign.filter(campaign => campaign.id === parseInt(idCampaign));
            if (campaignList.length > 0) {
                setCampaign(campaignList[0]);
            }
        }
    }, [listCampaign]);

    useEffect(() => {
        async function validateMailing() {
            // J'actualise en back avec mes données
            const response = await fetch(`${process.env.URL_API}/api/addMailing`, account.fetchOptionsPost(mailing));
            if (response.ok) {
                setMailing({
                    text: textCampaign,
                    idCampaign: idCampaign,
                    link: linkCampaign
                });
                navigate(`/liste/detail/${idCampaign}`);
            } else {
                setErrorServer(true)
            }
        }

        // Si mon state submit est à true je redirige le focus sur les champs en erreur, sinon j'appelle ma fonction de création du mailing
        if(isSubmit) {
            if (errorUrl){
                linkRef.current.focus()
            } else if(emptyText || tooLongText) {
                textRef.current.focus()
            } else {
                validateMailing()
            }
        }
    }, [change])

    return (
        <section className="section">
            <HeaderSection route={`/liste/detail/${idCampaign}`} title={"Création du mailing"} ariaLabel={"Retour page détails de la campagne"}/> 
            {!campaign.sent ? 
            <form className="section__form subsection" onSubmit={handleSubmitMailing}>
                <legend className='sr-only'>Création du mailing</legend>
                <fieldset className="section__form__fieldset">
                    <div className="section__form__fieldset__container">
                        <label htmlFor="link">Ajouter un lien au format https://example.com ou www.example.com</label>
                        <input 
                            className="section__form__fieldset__container__link"
                            type="text" 
                            name="link" 
                            id="link" 
                            onChange={handleChangeMailing} 
                            ref={linkRef} 
                            placeholder="https://example.com" 
                            aria-describedby={errorUrl ? 'errorUrlMsg' : null}
                            aria-invalid={errorServer || errorUrl ? true : null}    
                            value={mailing?.link}
                        />
                    </div>
                    <div className="section__form__fieldset__edit">
                        <div className="section__form__fieldset__edit__main">
                            <div className='section__form__fieldset__edit__main__header'>
                                <h2>{subjectCampaign}</h2>
                            </div>
                            <div className='section__form__fieldset__edit__main__container_img'>
                                <img src={`${process.env.URL_API}/images/${process.env.NAME_IMG}`} alt={`${process.env.ALT_IMG}`} />
                            </div>
                            <h3>Nom du destinataire</h3>
                            <textarea 
                                value={mailing?.text} 
                                name='text' 
                                ref={textRef} 
                                id="textEdit" 
                                aria-required='true'  
                                placeholder='Ecrire le contenu du mail ici, maximum 2500 caractères' 
                                onChange={handleChangeMailing}
                                aria-describedby={emptyText ? 'errorText' : tooLongText ? 'errorTextTooLong' : "contentDescription"}
                                aria-invalid={errorServer || emptyText ? true : null}>
                            </textarea>
                            <p id="contentDescription" className="sr-only">Contenu du mail, maximum 2500 caractères</p>
                        </div>
                        <div className="section__form__fieldset__edit__footer">
                            <div className="section__form__fieldset__edit__footer__socialNetworks">
                                <a href="#"><img src={`${process.env.URL_API}/images/picto_facebook_W.png`} className="logoSocialNetworks" alt="Aller vers la page Facebook"></img></a>
                                <a href="#"><img src={`${process.env.URL_API}/images/picto_twitter_W.png`} className="logoSocialNetworks" alt="Aller vers la page Twitter"></img></a>
                                <a href="#"><img src={`${process.env.URL_API}/images/picto_linkedn_W.png`} className="logoSocialNetworks" alt="Aller vers la page Linkedin"></img></a>
                            </div>
                            <div className="section__form__fieldset__edit__footer__adressBusiness">
                                <p>Nom de votre entreprise</p>
                                <p>Adresse de votre entreprise</p>
                                <p>CP et ville de votre entreprise</p>
                            </div>
                        </div>
                        <p className="section__form__fieldset__edit__footer__unsubscribe"><a href="#">Pour vous désinscrire, cliquez ici</a></p>
                    </div>
                    {errorUrl && <p id='errorUrlMsg' className='important'>Veuillez rentrer une url valide</p>}
                    {emptyText && <p id= 'errorText' className='important'>Veuillez remplir au minimum le texte du mail</p>}
                    {tooLongText && <p id= 'errorTextTooLong' className='important'>Le contenu du mail ne peut pas dépasser 2500 caractères</p>}
                    {errorServer && <p className='important'>Une erreur est survenue, veuillez reessayer ultérieurement</p>}

                    <div className="section__form__fieldset__buttonContainer">
                        <input type="reset" value="Réinitialiser le mailing"onClick={() => {setErrorUrl(false), setEmptyText(false), setIsSubmit(false), setErrorServer(false)}} className="section__form__fieldset__buttonContainer__reset button" />
                        <input type="submit" value="Valider" aria-label="Valider et retourner au détail de la campagne" className="section__form__fieldset__buttonContainer__submit button" />
                    </div>
                </fieldset>
            </form> : <p className='msg-access-denied'>L'accès à cette page n'est pas autorisé si la campagne a été envoyée</p>}
        </section>
    )
}

export default createMailing;