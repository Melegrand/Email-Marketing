import { useRef, useState } from 'react'
import './index.scss'
import logo from './image_login.svg';
import { useNavigate } from 'react-router-dom';
import account from '../../auth/utils';
import * as dotenv from 'dotenv';
import Validator from 'validator';
dotenv.config();

const Login = ({setUser}) => {
  const timeToken = 60*60*24*1000;
  // State qui gère le message d'erreur
  const [error, setError] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorServer, setErrorServer] = useState(false);
  const [errorEmailExist, setErrorEmailExist] = useState(false);
  const [errorPasswordDifferent, setErrorPasswordDifferent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const mail= useRef(null)
  const password= useRef(null)
  const firstName= useRef(null)
  const lastName= useRef(null)
  // State des informations saisies par l'utilisateur
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    lastname: '',
    firstname: ''
  })

  document.title = `Connexion ${error ? 'erreur' : ''}`

  const resetError = () => {
    setError(false);
    setErrorEmail(false);
    setErrorPassword(false);
    setErrorServer(false);
    setErrorEmailExist(false);
    setErrorLastName(false);
    setErrorFirstName(false);
    setErrorPasswordDifferent(false);
  }
  // fonction qui se charge de modifier le state avec les informations saisies par l'utilisateur
  const handleChange = (e) => {
    resetError()
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  // fonction qui se charge de valider les informations saisies par l'utilisateur et d'envoyé une requete vers l'api pour verifier si les informations sont valides
  const handleSubmit = async (e) => {
      e.preventDefault()
      setError(false)
      const options = { minLength: 14, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };

      if(!Validator.isEmail(loginData.email)) {
          setErrorEmail(true)
          setError(true)

          mail.current.focus();
      } else if(loginData.lastname === '' ||
          loginData.lastname === null ||
          loginData.lastname === undefined ||
          typeof(loginData.lastname) !== 'string' ||
          loginData.lastname.length < 2 ||
          loginData.lastname.length > 80) {
        
        setErrorLastName(true)
        setError(true)
        lastName.current.focus();
      } else if(loginData.firstname === '' ||
          loginData.firstname === null ||
          loginData.firstname === undefined ||
          typeof(loginData.firstname) !== 'string' ||
          loginData.firstname.length < 2 ||
          loginData.firstname.length > 80) {

        setErrorFirstName(true)
        setError(true)
        firstName.current.focus();
      
      }else if(
          loginData.password === '' ||
          loginData.password === null ||
          loginData.password === undefined ||
          typeof(loginData.password) !== 'string' ||
          !Validator.isStrongPassword(loginData.password, options)) {
          setErrorPassword(true)
          setError(true)
          password.current.focus();
      } else if (loginData.password !== loginData.passwordConfirm) {
          setErrorPasswordDifferent(true)
          setError(true)
          password.current.focus();
      }else {
          // Si le password et l'email sont valides, la reponse sera ok
          console.log('test')
          const response = await fetch(`${process.env.URL_API}/api/signup`, account.fetchOptionsPost(loginData));
          let responseData = await response.json();
          responseData = responseData.response
          // Si la reponse n'est pas ok un message d'erreur est affiché
          if (responseData === 'exist') {
            // L'erreur s'affiche 
            setErrorEmailExist(true);
            setError(true)
            // je focus sur le premier champs
            mail.current.focus();
            // Les informations du formulaire de mot de passe se vident
          } else if (responseData === 'error') {
            // Si la reponse est ok, le token est enregisté et l'utilisateur est redirigé vers l'accueil
            setError(true)
            setErrorServer(true)
          } else if (responseData === 'success') {
            setIsLoading(true);
            setTimeout(() => {
              navigate('/')
            }, 3000);
          }
      }       
  }

  return (
    <section className="login">
      <div className="login__header">
        <h2 className="login__header__title">Inscription</h2>
      </div>
      <div className="login__containersignup">
        <div className="login__containersignup__logo"><img src={logo} alt=''/></div>
        {!isLoading && <form action="/pagelogin" method="POST" className="login__containersignup__form" onSubmit={handleSubmit}>
          <fieldset>
            <legend className='sr-only'>Inscription</legend>
            <span className='important login__containersignup__form__obligatory'>Obligatoire *</span>
            <label htmlFor="email" className="login__containersignup__form__label">Email <span className="important">*</span></label>
            <input 
              ref={mail}
              type="email" 
              className="login__containersignup__form__email" 
              name="email" 
              id='email' 
              value={loginData.email} 
              onChange={handleChange} 
              aria-required='true' 
              aria-describedby={errorEmail ? "errorEmail" : errorEmailExist ? "errorEmailExist" : ""} 
              aria-invalid={error ? true : null}
            />
            {errorEmail && <p className='login__containersignup__form__error important' id='errorEmail'>Le format de l'email est invalide, veuillez rentrer une adresse email valide</p>}
            {errorEmailExist && <p className='login__containersignup__form__error important' id='errorEmailExist'>Cet email existe déja, veuillez en choisir un autre</p>}

            <label htmlFor="lastname" className="section__form__fieldset__label">Nom de famille <span className="important" aria-hidden="true">*</span></label>
            <input 
                type="text" 
                className="login__containersignup__form__name" 
                name="lastname" 
                value={loginData.lastname} 
                id="lastname" 
                onChange={handleChange} 
                aria-required="true" 
                ref={lastName} 
                aria-invalid={errorLastName ? true : false} 
                aria-describedby={errorLastName ? "errorLastName" : ""}
            />
            {errorLastName && <p className='login__containersignup__form__error important' id='errorLastName'>Le nom de famille doit contenir au moins 2 caractères</p>}


            <label htmlFor="firstname" className="section__form__fieldset__label">Prénom <span className="important" aria-hidden="true">*</span></label>
            <input 
                type="text" 
                className="login__containersignup__form__name"
                name="firstname" 
                id="firstname" 
                value={loginData.firstname} 
                onChange={handleChange} 
                aria-required="true" 
                ref={firstName} 
                aria-invalid={errorFirstName ? true : false} 
                aria-describedby={errorFirstName ? "errorFirstName" : ""}
            />
            {errorFirstName && <p className='login__containersignup__form__error important' id='errorFirstName'>Le Prénom doit contenir au moins 2 caractères</p>}

            <label htmlFor="password" className="login__containersignup__form__label">Mot de passe <span className="important">*</span></label>
            <input 
              ref={password}
              type="password" 
              className="login__containersignup__form__password" 
              name="password" 
              id='password' 
              value={loginData.password} 
              onChange={handleChange} 
              aria-required='true' 
              aria-describedby={errorPassword ? "errorPassword" : ""} 
              aria-invalid={errorPassword ? true : null}
            />
            {errorPassword && <p className='login__containersignup__form__error important' id='errorPassword'>Le mot de passe doit contenir au moins 14 caractères, une majuscule, une minuscule, un chiffre et un symbole</p>}
          
            <label htmlFor="passwordConfirm" className="login__containersignup__form__label">Confirmez le mot de passe<span className="important">*</span></label>
            <input 
              type="password" 
              className="login__containersignup__form__password" 
              name="passwordConfirm" 
              id='passwordConfirm' 
              value={loginData.passwordConfirm} 
              onChange={handleChange} 
              aria-required='true' 
              aria-describedby={errorPasswordDifferent ? "errorPasswordDifferent" : ""} 
              aria-invalid={errorPasswordDifferent ? true : null}
            />
            {errorPasswordDifferent && <p className='login__containersignup__form__error important' id='errorPasswordDifferent'>Les mots de passe doivent être identiques</p>}

            {errorServer && <p className='login__containersignup__form__error important' id='errorServer'>Une erreur s'est produite, merci de réessayer ultérrieurement</p>}
            <div className="login__containersignup__form__buttonContainer">
              <input 
                type="submit" 
                className="login__containersignup__form__submit" 
                value="Valider" 
                aria-label="Valider et aller à la page d'accueil"
              />
            </div>
          </fieldset>
          <footer className="login__containersignup__footersignup">
            <p>Besoin d'aide ? <a href="#">Contactez-nous</a></p>
          </footer>
        </form>}
        {isLoading && <p>Compte créé avec succès ! Redirection vers la page de connexion</p>}
      </div>
    </section>
  )
}

export default Login;