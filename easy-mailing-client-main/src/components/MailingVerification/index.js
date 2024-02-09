import { useParams, useNavigate, Link } from "react-router-dom";
import HeaderSection from "../HeaderSection";
import { useState, useEffect, useRef } from "react";
import './index.scss';
import dateFormat from "dateformat";
import account from "../../auth/utils";
import * as dotenv from 'dotenv';
dotenv.config();

const MailingVerification = () => {
    // State qui gère si si l'envoi de test s'est bien effectué
    const [successMsg, setSuccessMsg] = useState(false);
    // State qui gère si il y a une erreur de format du mail
    const [errorMail, setErrorMail] = useState(false);
    // State qui gère si il y a une erreur dans l'envoie de la campagne
    const [errorMailSendCampaign, setErrorMailSendCampaign] = useState(false);
    // State qui gère si il y a une erreur dans l'envoi du mail de test
    const [errorMsg, setErrorMsg] = useState(false);
    // State qui gère si l'utilisateur a validé le formulaire de test
    const [changeTest, setChangeTest] = useState(false);
    // State qui gère si l'utilisateur a validé pour envoyer la campagne
    const [changeSend, setChangeSend] = useState(false);
    // State qui gère les informations du mailling
    const [mailingDetail, setMailingDetail] = useState();

    const navigate = useNavigate();
    const { currentId } = useParams();

    const [statusCampaign, setStatusCampaign] = useState({
        status: false,
        id: currentId,
        startDate: '',
    });

    // Ref sur l'input de mail
    const email = useRef(null)
    // Refs sur les msg d'état
    const success = useRef(null)
    const errorSend = useRef(null)

    document.title = 'Vérification du mailing'

    // Fonction qui reset les states d'erreur et de réussite
    function resetState() {
        setSuccessMsg(false);
        setErrorMail(false);
        setErrorMsg(false);
        setErrorMailSendCampaign(false);
    }

    // Requête pour récupérer les détails du mailling
    const mailingDetails = async () => {
        const response = await fetch(`${process.env.URL_API}/api/campaignDetail/${currentId}`, account.fetchOptionsGet());
        const data = await response.json();
        setMailingDetail(data);
    }

    // Fonction qui gère l'envoi de la campagne
    const handleSend = async (e) => {
        // j'empêche le rechargement de la page
        e.preventDefault();
        // Je remets mes states à false
        resetState();
        try {
            // Si mon nombre de contact est différent de 0 je l'envoi
            if (mailingDetail?.nbrContact !== 0) {
                const response = await fetch(`${process.env.URL_API}/api/validateCampaign`, account.fetchOptionsPost(statusCampaign));
                if (response.ok) {
                    // Si la répponse est ok je redirige vers la page de détail
                    navigate(`/liste/detail/${currentId}`);
                } else {
                    // Sinon je jette une erreur
                    setErrorMailSendCampaign(true);
                }
            }
        } catch (error) {
            console.error(error)
        }

        // Je met mon state de changement à jour
        setChangeSend(changeSend ? false : true);
    }

    // Fonction qui gère l'envoi du test
    const sendTest = async (e) => {
        // j'empêche le rechargement de la page
        e.preventDefault();
        // Je remets mes states à false
        resetState();
        const regexMail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        try {
            if (e.target.test.value !== "" && regexMail.test(e.target.test.value)) {
                // Si le mail n'est pas vide et que le format est correct je l'envoi
                if (mailingDetail?.nbrContact !== 0) {
                    const response = await fetch(`${process.env.URL_API}/api/testSendCampaign`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${account.getToken()}`
                        },
                        body: JSON.stringify({
                            status: false,
                            id: currentId,
                            startDate: '',
                            emailTest: e.target.test.value
                        })
                    });
                    // Si la réponse n'est pas ok, je jette une erreur
                    if (!response.ok) {
                        setErrorMsg(true);
                        throw new Error('La reponse n\'est pas ok');
                    } else {
                        // Si tout est ok, j'affiche un message de succès et je remet la valeur du champs à 0
                        e.target.test.value = "";
                        setSuccessMsg(true);
                    }
                }
            } else {
                // si le format n'est pas correct je jette une erreur
                setErrorMail(true);
            }
        } catch (error) {
            console.error(error);
        }
        // Je met mon state de changement à jour
        setChangeTest(changeTest ? false : true);
    }

    useEffect(() => {
        // Quand mon state changeTest change, je mets le focus sur l'input de mail en cas d'erreur
        if(errorMail) {
            email.current.focus();
            // Sinon je mets le focus sur le messsage de succès
        } else if( successMsg ) {
            success.current.focus();
            // Sinon je mets le focus sur le message d'erreur d'envoi
        } else if (errorMailSendCampaign) {
            errorSend.current.focus();
        }
    }, [changeTest]);

    useEffect(() => {
        // Quand mon state changeSend change, je mets le focus sur le message d'erreur si il y a une erreur
        if (errorMailSendCampaign) {
            errorSend.current.focus();
        }
    }, [changeSend]);

    useEffect(() => {
        // Je définis les informations de mon mailling par défaut
        mailingDetails();
    }, []);

    useEffect(() => {
        // Je définis les informations de mon mailling avec les infos du mailling
        mailingDetail?.nbrContact > 0 ? setStatusCampaign({ status: true, id: currentId, startDate: dateFormat(new Date(mailingDetail.startCampaign), "yyyy-mm-dd") }) : setStatusCampaign({ status: false, id: currentId, startDate: dateFormat(new Date(), "yyyy-mm-dd") })
    }, [mailingDetail])

    console.log(mailingDetail)
    return (
        <section className="verification__mailing">
            <HeaderSection route={`/liste/detail/${currentId}`} title={mailingDetail?.nameCampaign} ariaLabel={"Retour page détails de la campagne"}/>
            <section className="verification__mailing__section">
                <div className="verification__mailing__section__header">
                    <h1>{mailingDetail?.subjectCampaign}</h1>
                </div>
                <div className="verification__mailing__section__main">
                    <div className="verification__mailing__section__main__img">
                        <img src={`${process.env.URL_API}/images/${process.env.NAME_IMG}`} alt={`${process.env.ALT_IMG}`} />
                    </div>
                    <h2>Nom du destinataire</h2>
                    <p>{mailingDetail?.textCampaign}<br></br><a href={mailingDetail?.linkCampaign} target="_blank" rel="noopener noreferrer">{mailingDetail?.linkCampaign}</a></p>
                </div>
                <div className="verification__mailing__section__footer">
                    <div className="verification__mailing__section__footer__container__contact">
                        <div className="verification__mailing__section__footer__container__contact__socialNetworks">
                            <a href="#"><img src={`${process.env.URL_API}/images/picto_facebook_W.png`} className="logoSocialNetworks" alt="Aller vers la page Facebook"></img></a>
                            <a href="#"><img src={`${process.env.URL_API}/images/picto_twitter_W.png`} className="logoSocialNetworks" alt="Aller vers la page Twitter"></img></a>
                            <a href="#"><img src={`${process.env.URL_API}/images/picto_linkedn_W.png`} className="logoSocialNetworks" alt="Aller vers la page Linkedin"></img></a>
                        </div>
                        <div className="verification__mailing__section__footer__container__contact__adressBusiness">
                            <p>Nom de votre entreprise</p>
                            <p>Adresse de votre entreprise</p>
                            <p>CP et ville de votre entreprise</p>
                        </div>
                    </div>
                    <p className="verification__mailing__section__footer__unsubscribe">Pour vous désinscrire, <a href="#">cliquez ici</a></p>
                </div>
            </section>

            {/* Si la campagne est complete et prete à etre valider pour la programmation */}
            {mailingDetail?.nbrContact > 0 && mailingDetail?.mailing && !mailingDetail?.full && !mailingDetail?.sent && (
                <>
                    <form onSubmit={sendTest}>
                        <fieldset>
                            <legend className="sr-only">Formulaire envoi de test</legend>
                            <div>
                                <label htmlFor="test">Entrez l'email de test : </label>
                                {errorMsg && <p className="error-msg important" id="errorMsg">Un problème est survenu, l'email de test n'a pas été envoyé</p>}
                                {errorMail && <p className="error-email important" id="errorMail">Veuillez renseigner une adresse mail valide, exemple : test@exemple.com</p>}
                                {successMsg && <p className="success-msg success" id="successMsg" ref={success} tabIndex={0}>L'email a bien été envoyé</p>}
                            </div>
                            <div>
                                <input 
                                    type="text" 
                                    name="test" 
                                    id="test" 
                                    ref={email} 
                                    placeholder="test@exemple.com" 
                                    aria-invalid={errorMail ? true : null}
                                    aria-describedby={errorMail ? 'errorMail ' : 'describeMail'}
                                />
                                <span className="sr-only" id="describeMail"></span>
                                <input type="submit" value="Envoyer le test"/>
                            </div>
                        </fieldset>
                    </form>
                    {errorMailSendCampaign && <p className="error-msg important" id="errorMsg" ref={errorSend} tabIndex={0}>Un problème est survenu, la campagne n'a pas été envoyée</p>}
                    <button className="verification__mailing__button__send" onClick={handleSend} aria-label="Valider pour envoyer la campagne et retourner à la page de détails">Valider pour envoyer la campagne</button>
                </>
            )}

            {/* Si la campagne est fini et prete à etre renvoye */}
            {mailingDetail?.nbrContact > 0 && !mailingDetail?.full && mailingDetail?.sent && dateFormat(mailingDetail?.endCampaign, "yyyy-mm-dd") <= dateFormat(new Date(), "yyyy-mm-dd") && <button className="verification__mailing__button__send" onClick={handleSend}>Valider pour renvoyer la campagne</button>}

            {/* Si la campagne n'a pas de contact */}
            {mailingDetail?.nbrContact === 0 && <Link to={`/liste/detail/${currentId}/contacts`} className="verification__mailing__paragraph" aria-label="Contacts nécessaires, aller à la page contacts">Vous devez avoir une liste de contacts pour continuez</Link>}

            {/* Si la campagne est complète et programmée pour l'envoi */}
            {mailingDetail?.nbrContact !== 0 && mailingDetail?.full && !mailingDetail?.sent && <p className="verification__mailing__paragraph">La campagne est complète et programmé pour etre envoyée {dateFormat(mailingDetail?.startCampaign, "dd/mm/yyyy")}</p>}

            {/* Si la campagne est envoyée, attention ce message n'apparait pas si la campagne etait d'une seul journée */}
            {mailingDetail?.nbrContact > 0 && !mailingDetail?.full && mailingDetail?.sent && dateFormat(mailingDetail?.endCampaign, "yyyy-mm-dd") > dateFormat(new Date(), "yyyy-mm-dd") && <p className="verification__mailing__paragraph">La campagne est en cours jusqu'au {dateFormat(mailingDetail?.endCampaign, "dd/mm/yyyy")}</p>}
        </section>
    )
}

export default MailingVerification;