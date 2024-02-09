import { useState } from 'react';
import './index.scss'
import { useEffect } from 'react';
import * as dotenv from 'dotenv';
dotenv.config();

const Unsubscribed = () => {
    // State qui gère la désinscription
    const [isUnsubscribed, setIsUnsubscribed] = useState(false);
    // State qui gère le réinscription
    const [isRegisterAgain, setIsRegisterAgain] = useState(false);
    // State qui gère l'affichage d'une erreur
    const [error, setError] = useState(false);

    document.title = `Désinscription ${error ? 'erreur' : ''}`

    function getToken() {
        let replacedString;
        // Obtenir l'URL actuelle
        const currentUrl = window.location.href;
        // Diviser l'URL par le délimiteur '/'
        const parts = currentUrl.split('/');
        // Trouver l'index de "unsubscribed" dans les parties de l'URL
        const indexOfUnsubscribed = parts.indexOf('unsubscribed');
        // Vérifier si "unsubscribed" a été trouvé
        if (indexOfUnsubscribed !== -1) {
            // Récupérer la partie de l'URL après "unsubscribed"
            //  parts.slice(indexOfUnsubscribed + 1) : Crée un nouveau tableau contenant toutes les parties de l'URL à partir de l'élément juste après "unsubscribed
            // .join('/') : Rejoint toutes ces parties en une seule chaîne de caractères, en utilisant "/".
            replacedString = parts.slice(indexOfUnsubscribed + 1).join('/');
        }
        return replacedString;
    }

    async function handleSubscribed(){
        // Je fais ma requête à mon api qui va réinscrire l'utilisateur
        // j'utilise getToken pour récuppérer le token dans l'url
        const response = await fetch(`${process.env.URL_API}/api/subscribed/${getToken()}`);
        // Mon api va renvoyer un boolean, true si réinscrit correctement, false sinon
        const subscribedRequest = await response.json();
        // Je passe mon état de réinscription au state isRegisterAgain
        setIsRegisterAgain(subscribedRequest);
        // Si mon utilisateur et réinscrit je passe la désinscription à false
        subscribedRequest && setIsUnsubscribed(false);
        // Si pas désinscrit je mets mon state d'erreur à true, il va afficher un message à l'utilisateur
        !subscribedRequest && setError(true);
    }

    async function checkUnsubscribed() {
        // Je fais ma requête à mon api qui va désiscrire l'utilisateur
        // j'utilise getToken pour récuppérer le token dans l'url
        const response = await fetch(`${process.env.URL_API}/api/unsubscribed/${getToken()}`);
        // Mon api va renvoyer un boolean, true si désinscrit correctement, false sinon
        const unsubscribedRequest = await response.json();
        // Je passe mon état de désinscription au state isUnsubscribed
        setIsUnsubscribed(unsubscribedRequest)
        // Si pas désinscrit je mets mon state d'erreur à true, il va afficher un message à l'utilisateur
        !unsubscribedRequest && setError(true);
    }

    useEffect(() => {
        // Au chargement de la page j'appelle la fonction checkUnsubscribed qui va désinscrir l'utilisateur
        checkUnsubscribed();
    }, []);

    return (
        <section className='unsubscribed'>

        {/* Si le token n'est pas valide ou que l'api renvoie une erreur j'affiche le message d'erreur*/}
        {error &&
            <div className='unsubscribed__box'>
                {error && <p className="unsubscribed__box--error">Une erreur est survenue, veuillez réessayer ultérieurement</p>}
            </div>
        }
        {/* Si mon utilistauer est desinscrit (par le state isUnsubscribed) j'affiche le message de confirmation*/}
        {isUnsubscribed &&
            <div className='unsubscribed__box'>
                <p>Votre désinscription a bien été prise en compte</p>
                <input className='btn--unsubscribed' type="button" id="unsubscribed" name="unsubscribed" value="Je change d'avis et je me réinscris" onClick={handleSubscribed}/>
            </div>
        }
        {/* Si mon utilistauer est réinscrit (par le state isRegisterAgain) j'affiche le message de confirmation de réinscription*/}
        {isRegisterAgain &&
            <div className='unsubscribed__box'>
                <p>Merci pour votre réinscription !</p>
            </div>
        }
        </section>
    )
}

export default Unsubscribed;