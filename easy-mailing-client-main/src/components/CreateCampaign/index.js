import './index.scss';
import HeaderSection from '../HeaderSection';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dateFormat from 'dateformat';
import account from '../../auth/utils';
import * as dotenv from 'dotenv';

dotenv.config();

const CreateCampaign = () => {
    // State qui gère si il y a une erreur de format dans le nom de campagne
    const [errorName, setErrorName] = useState(false);
    // State qui gère si il y a manque l'année
    const [errorMail, setErrorMail] = useState(false);
    // State qui gère si il y a une erreur dans le format de sujet
    const [errorSubject, setErrorSubject] = useState(false);
    // State qui gère si il la date début est avant la date du jour
    const [errorDateStartBeforeNow, setErrorDateStartBeforeNow] = useState(false);
    // State qui gère si la date de début est après la date de fin
    const [errorDateStartAfterEnd, setErrorDateStartAfterEnd] = useState(false);
    // State qui gère si la date de fin est avant la date de début
    const [errorDateEndBeforeStart, setErrorDateEndBeforeStart] = useState(false);
    // State qui gère si il la date de fin est avant la date du jour
    const [errorDateEndBeforeNow, setErrorDateEndBeforeNow] = useState(false);
    // State qui gère si la date de fin est vide
    const [errorDateEndEmpty, setErrorDateEndEmpty] = useState(false);
    // State qui gère si la réponse du back est bonne
    const [errorResponse, setErrorResponse] = useState(false);
    // State qui gère si l'utilisateur a validé le formulaire
    const [change, setChange] = useState(false);
    // State qui gère si l'utilisateur a validé le formulaire
    const [isSubmit, setIsSubmit] = useState(false);

    // Email par defaut récupéré dans le local storage
    const userEmail = localStorage.getItem('email');

    // déclaration du useNavigate
    let navigate = useNavigate();

    // Data du formulaire par défaut
    const [formData, setFormData] = useState({
        nameCampaign: '',
        subject: '',
        emailCreator: userEmail,
        startDate: dateFormat(new Date(), "yyyy-mm-dd"),
        endDate: '',
    });

    // Refs sur les inputs
    const name = useRef(null)
    const email = useRef(null)
    const subject = useRef(null)
    const start = useRef(null)
    const end = useRef(null)

    // Data du formulaire
    const data = {
        nameCampaign: formData.nameCampaign,
        subject: formData.subject,
        emailCreator: formData.emailCreator,
        startDate: formData.startDate,
        endDate: formData.endDate,
    };
    
    // Cette fonction sert à envoyer les données du formulaire vers le state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    // fonction qui reset les states
    function resetStates() {
        setErrorName(false)
        setErrorMail(false)
        setErrorSubject(false)
        setErrorDateStartBeforeNow(false)
        setErrorDateStartAfterEnd(false)
        setErrorDateEndEmpty(false)
        setErrorDateEndBeforeStart(false)
        setErrorDateEndBeforeNow(false)
        setErrorResponse(false)
        setIsSubmit(false)
    }

    document.title = `Création de campagne ${
        errorName 
        || errorMail 
        || errorSubject 
        || errorDateStartBeforeNow 
        || errorDateStartAfterEnd 
        || errorDateEndEmpty 
        || errorDateEndBeforeNow
        || errorDateEndBeforeStart
        || errorResponse ? 'erreur' : ''}`

    // Fonction qui reset les inputs
    function handleReset() {
        setFormData({
            nameCampaign: '',
            subject: '',
            emailCreator: userEmail,
            startDate: dateFormat(new Date(), "yyyy-mm-dd"),
            endDate: '',
        })
        resetStates()
    }

    // fonction appellée au submit, va vérifier les formats des données et leur logique (ex : date de début pas avant la date de fin)
    const handleSubmit = async (e) => {
        // j'empeche le rechargement de la page
        e.preventDefault();

        // Je reset mes states d'erreurs
        resetStates()

        // Regex pour le format de mail
        const regexMail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        const startDate = new Date(data.startDate).getTime();
        const endDate = new Date(data.endDate).getTime();

        // Si date de début antérieur à la date du jour je jette une erreur
        if (data.startDate < dateFormat(new Date(), "yyyy-mm-dd")) {
            setErrorDateStartBeforeNow(true)
        } 

        // Si date de début postérieur à date de fin je jette une erreur
        if (startDate > endDate) {
            setErrorDateStartAfterEnd(true)
        } 

        // Si date de fin n'est pas vide
        if (data.endDate.length > 0) {
            // Et que la date de fin est antérieure à la date du jour je jette une erreur
            if(data.endDate < dateFormat(new Date(), "yyyy-mm-dd")) {
                setErrorDateEndBeforeNow(true)
            }
        }

        // Si date de fin antérieur à date de début je jette une erreur
        if (endDate < startDate) {
            setErrorDateEndBeforeStart(true)
        } 

        // Si date de fin est vide je jette une erreur
        if (data.endDate.length === 0) {
            setErrorDateEndEmpty(true)
        } 

        // Si le nom de campagne est vide ou dépasse 80 caractères je jette une erreur
        if (data.nameCampaign.length > 80 || data.nameCampaign === '') {
            setErrorName(true)
        }

        // Si le sujet est vide ou dépasser 80 caractères je jette une erreur
        if (data.subject.length > 80 || data.subject === '') {
            setErrorSubject(true)
        }

        // Si l'adresse mail est vide ou n'est pas valide je jette une erreur
        if (!regexMail.test(data.emailCreator) || data.emailCreator === '') {
            setErrorMail(true)
        }

        // J'actualise mon state de changement qui va permettre d'appler le useEffect car il est en dépendance
        setChange(change ? false : true)
        setIsSubmit(true)
    } 

    // Cette fonction sert à envoyer les données du formulaire vers la base de données

    async function checkAndAdd() {

        // Si pas d'erreur
        if (!errorName && !errorMail && !errorSubject && !errorDateStartBeforeNow && !errorDateStartAfterEnd && !errorDateEndEmpty && !errorDateEndBeforeStart && !errorDateEndBeforeNow) {
            // Envoi des données vers la base de données si tout est ok
            const response = await fetch(`${process.env.URL_API}/api/createCampaign`, account.fetchOptionsPost(data));
            if (!response.ok) {
                // Si erreur de la part du serveur je jette une erreur
                setErrorResponse(true);
            } else {
                // Redirection vers la liste une fois que les données sont enregistrées
                navigate("/liste");
            }
        }
    }


    useEffect(() => {
        // J'appelle la fonction checkAndAdd quand le state de changement change pour créer la campagne
        isSubmit && checkAndAdd()

        // Je gère la redirection du focus en cas d'erreur
        if (errorName) {
            name.current.focus();
        } else if (errorMail) {
            email.current.focus();
        } else if (errorSubject) {
            subject.current.focus();
        } else if (errorDateStartBeforeNow || errorDateStartAfterEnd) {
            start.current.focus();
        } else if (errorDateEndBeforeNow || errorDateEndEmpty || errorDateEndBeforeStart) {
            end.current.focus();
        }
    }, [change]);

    return (
        <section className="section">
            <HeaderSection route={"/"} title={"Creation de campagne"} ariaLabel={"Retour accueil"}/>
            <form method="POST" className="section__form subsection" onSubmit={handleSubmit}>
                <legend className='sr-only'>Formulaire de création de campagne</legend>
                <fieldset className="section__form__fieldset">
                    <span className='important' aria-hidden="true">* Champs obligatoires</span>
                    <label htmlFor="nameCampaign" className="section__form__fieldset__label">Nom de la campagne <span className="important" aria-hidden="true">*</span></label>
                    <input 
                        type="text" 
                        className="section__form__fieldset__nameCampaign" 
                        name="nameCampaign" 
                        id="nameCampaign" 
                        max={80}
                        aria-describedby={errorName ? "errorName" : 'describeName'}
                        onChange={handleChange}
                        ref={name}
                        aria-invalid={errorName ? true : null}
                        aria-required
                    />
                    <span className='sr-only' id='describeName'>Doit faire moins de 80 caractères</span>
                    {errorName && <p className='important errorCampaign' id="errorName">Le nom de campagne ne peut pas être vide et ne doit pas dépasser 80 caractères</p>}

                    <label htmlFor="emailCreator" className="section__form__fieldset__label">Email du créateur de la campagne  <span className="important" aria-hidden="true">*</span></label>
                    <input 
                        type="email" 
                        className="section__form__fieldset__emailCreator" 
                        name="emailCreator" 
                        id="emailCreator"  
                        aria-describedby={errorMail ? "errorMail" : 'describeMail'}
                        max={80} 
                        value={formData.emailCreator} 
                        onChange={handleChange}
                        ref={email}
                        aria-invalid={errorMail ? true : null}
                        aria-required
                    />
                    <span className='sr-only' id='describeMail'>Format attendu exemple : email@example.com</span>
                    {errorMail && <p className='important errorCampaign' id="errorMail">L'email ne peut pas être vide et doit être au format : email@example.com</p>}
                    
                    <label htmlFor="subject" className="section__form__fieldset__label">Sujet de la campagne<span className="important" aria-hidden="true">*</span></label>
                    <input 
                        type="text" 
                        className="section__form__fieldset__subject" 
                        name="subject" 
                        id="subject"  
                        aria-describedby={errorSubject ? "errorSubject" : 'describeSubject'}
                        max={80} 
                        onChange={handleChange}
                        ref={subject}
                        aria-invalid={errorSubject ? true : null}
                        aria-required
                    />
                    <span className='sr-only' id='describeSubject'>Doit faire moins de 80 caractères</span>
                    {errorSubject && <p className='important errorCampaign' id="errorSubject">Le sujet de la campagne ne peut pas être vide et ne doit pas dépasser 80 caractères</p>}

                    <div className="section__form__fieldset__dateContainer">
                        <div className="section__form__fieldset__startDateContainer">
                            <label htmlFor="startDate" className="section__form__fieldset__label">Date du début et d'envoi<span className="important" aria-hidden="true">*</span></label>
                            <input 
                                type="date" 
                                className="section__form__fieldset__startDate" 
                                name="startDate" 
                                id="startDate" 
                                aria-describedby={`${
                                    errorDateStartBeforeNow ? 'errorDateStartBeforeNow ' : ''
                                }${
                                    errorDateStartAfterEnd ? 'errorDateStartAfterEnd ' : ''
                                }${!errorDateStartBeforeNow && !errorDateStartAfterEnd ? 'describeStart' : ''}`}
                                value={data.startDate} 
                                onChange={handleChange}
                                ref={start}
                                aria-invalid={errorDateStartBeforeNow || errorDateStartAfterEnd ? true : null}
                                aria-required
                            />
                            <span className='sr-only' id='describeStart'>Format attendu : JJ/MM/AAAA, exemple : 01/09/2023, date supérieure ou égale à la date du jour.</span>
                            {errorDateStartBeforeNow && <p className='important errorCampaign' id="errorDateStartBeforeNow">La date de début ne doit pas être antérieure à la date du jour.</p>}
                            {errorDateStartAfterEnd && <p className='important errorCampaign' id="errorDateStartAfterEnd">La date début ne doit pas être suppérieur à la date de fin.</p>}
                        </div>
                        <div className="section__form__fieldset__endDateContainer">
                            <label htmlFor="endDate" className="section__form__fieldset__label">Date de fin <span lang="en">(marketing)</span><span className="important" aria-hidden="true">*</span></label>
                            <input 
                                type="date" 
                                className="section__form__fieldset__endDate" 
                                name="endDate" 
                                id="endDate" 
                                aria-describedby={`${
                                    errorDateEndEmpty ? 'errorDateEndEmpty ' : ''
                                }${
                                    errorDateEndBeforeNow ? 'errorDateEndBeforeNow ' : ''
                                }${
                                    errorDateEndBeforeStart ? 'errorDateEndBeforeStart' : ''
                                }${!errorDateEndEmpty && !errorDateEndBeforeNow && !errorDateEndBeforeStart ? 'describeEndDate' : ''}`}
                                onChange={handleChange}
                                ref={end}
                                aria-invalid={errorDateEndEmpty || errorDateEndBeforeStart || errorDateEndBeforeNow ? true : null}
                                aria-required
                            />
                            <span className='sr-only' id='describeEndDate'>Format attendu : JJ/MM/AAAA, exemple : 01/09/2023, date supérieure ou égale à la date du jour et à la date de début.</span>
                            {errorDateEndEmpty && <p className='important errorCampaign' id="errorDateEndEmpty">La date de fin ne peut pas être vide.</p>}
                            {errorDateEndBeforeNow && <p className='important errorCampaign' id="errorDateEndBeforeNow">La date de fin ne doit pas être antérieure à la date du jour.</p>}
                            {errorDateEndBeforeStart && <p className='important errorCampaign' id="errorDateEndBeforeStart">La date de fin ne doit pas être antérieure à la date de début.</p>}
                        </div>
                    </div>
                    {errorResponse && <p className='important'>Une erreur est survenue, veuillez réessayer ultérieurement.</p>}

                    <div className="section__form__fieldset__buttonContainer">
                        <input type="reset" value="Réinitialiser" onClick={handleReset} className="section__form__fieldset__buttonContainer__reset button" aria-label='Reinitialiser les champs du formulaire'/>
                        <input type="submit" value="Valider" className="section__form__fieldset__buttonContainer__submit button" aria-label='Valider et aller à la liste des campagnes'/>
                    </div>
                </fieldset>
            </form>
        </section>
    )
}

export default CreateCampaign;