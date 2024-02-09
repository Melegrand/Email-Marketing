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
  const navigate = useNavigate();
  const mail= useRef(null)
  // State des informations saisies par l'utilisateur
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  document.title = `Connexion ${error ? 'erreur' : ''}`

  // fonction qui se charge de modifier le state avec les informations saisies par l'utilisateur
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  // fonction qui se charge de valider les informations saisies par l'utilisateur et d'envoyé une requete vers l'api pour verifier si les informations sont valides
  const handleSubmit = async (e) => {
      e.preventDefault()
      setError(false)

      if(!Validator.isEmail(loginData.email)) {
          setError(true)
          mail.current.focus();
      } else if(
          loginData.password === '' ||
          loginData.password === null ||
          loginData.password === undefined ||
          typeof(loginData.password) !== 'string') {
          setError(true)
          password.current.focus();
      } else {
          setError(false);
          // Si le password et l'email sont valides, la reponse sera ok
          const response = await fetch(`${process.env.URL_API}/api/login`, account.fetchOptionsPost(loginData));
          // Si la reponse n'est pas ok un message d'erreur est affiché
          if (!response.ok) {
            // L'erreur s'affiche 
            setError(true);
            // je focus sur le premier champs
            mail.current.focus();
            // Les informations du formulaire de mot de passe se vident
            setLoginData({
              email: loginData.email,
              password: ''
            });
          } else {
            // Si la reponse est ok, le token est enregisté et l'utilisateur est redirigé vers l'accueil
            const responseData = await response.json();
            account.saveToken(responseData.token)
            account.saveId(responseData.userId)
            account.saveEmail(responseData.email)
            setUser(true);
            navigate('/')
            setTimeout(() => {
              account.logout();
              setUser(false);
            }, timeToken);
          }
      }       
  }
   

  return (
    <section className="login">
      <div className="login__header">
        <h2 className="login__header__title">Connexion</h2>
      </div>
      <div className="login__container">
        <div className="login__container__logo"><img src={logo} alt=''/></div>
        <form action="/pagelogin" method="POST" className="login__container__form" onSubmit={handleSubmit}>
          <fieldset>
            <legend className='sr-only'>Connexion</legend>
            <span className='important login__container__form__obligatory'>Obligatoire *</span>
            <label htmlFor="email" className="login__container__form__label" ref={mail}>Email <span className="important">*</span></label>
            <input 
              type="email" 
              className="login__container__form__email" 
              name="email" 
              id='email' 
              value={loginData.email} 
              onChange={handleChange} 
              aria-required='true' 
              aria-describedby={error ? "error" : null} 
              aria-invalid={error ? true : null}
            />
            <label htmlFor="password" className="login__container__form__label">Mot de passe <span className="important">*</span></label>
            <input 
              type="password" 
              className="login__container__form__password" 
              name="password" 
              id='password' 
              value={loginData.password} 
              onChange={handleChange} 
              aria-required='true' 
              aria-describedby={error ? "error" : null} 
              aria-invalid={error ? true : null}
            />
            {error && <p className='login__container__form__error important' id='error'>L'email ou le mot de passe est incorrect</p>}
            <div className="login__container__form__buttonContainer">
              <input 
                type="submit" 
                className="login__container__form__submit" 
                value="Valider" 
                aria-label="Valider et aller à la page d'accueil"
              />
            </div>
          </fieldset>
        </form>
        <footer className="login__container__footer">
          <p>Pas encore inscrit ? <a href="/signup">S'enregistrer</a></p>
          <p>Besoin d'aide ? <a href="#">Contactez-nous</a></p>
        </footer>
      </div>
    </section>
  )
}

export default Login;