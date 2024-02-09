import Header from '../Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Unsubscribed from '../Unsubscribed';
import ListCampaign from "../ListCampaign";
import DetailsCampaign from "../DetailsCampaign";
import Login from '../Login';
import AddContact from '../HandleContacts/AddContact';
import HandleContact from '../HandleContacts';
import CreateMailing from '../CreateMailing';
import MailingVerification from '../MailingVerification';
import NotFound from '../NotFound';
import Guard from '../../auth/Guard';
import Homepage from '../Homepage';
import CreateCampaign from '../CreateCampaign';
import account from '../../auth/utils';
import Statistic from '../Statistic';
import BreadCrumb from '../BreadCrumb'
import Sitemap from '../Sitemap';
import InvalidContact from '../HandleContacts/InvalidContact';
import * as dotenv from 'dotenv';
import Footer from '../Footer';
import Signup from '../Signup';
dotenv.config();
// Mon composant App gère uniquement le menu qui lui se chargera de gérer l'affichage des différents composants en plus du menu.
const App = () => {
  // Ce state gere si l'utilisateur est connecté ou non
  const [user, setUser] = useState(false)
  // Ce state gère la liste des campagnes
  const [listCampaign, setlistCampaign] = useState([]);
  // Ce state est le pathname de l'url courante qui permet ensuite de gérer pour l'accessibilité la page courante et son css
  const [location, setLocation] = useState('')
  // Ce state gère un état de changement pour appeler le useEffect à chaque fois qu'on change d'url (sans rafraichissement)
  const [locationChanged, setlocationChanged] = useState(false)

  // Cette fonction va chercher la liste des campagnes dans l'api
  const fetchCampaignList = async () => {
      const response = await fetch(`${process.env.URL_API}/api/listCampaign`, account.fetchOptionsGet());
      const data = await response.json();
      setlistCampaign(data);
  }

  function handleChangeLocation() {
    locationChanged ? setlocationChanged(false) : setlocationChanged(true)
  }

  // Ce useEffect se déclenche au chargement du composant pour appeler la fonction pour chercher le détail d'une campagne si l'utilisateur est connecté
  useEffect(() => {
      if (account.isLogged()) {
        fetchCampaignList();
      }
  }, [user]);

  // Ce useEffect se déclenche au chargement du composant pour appeler la fonction pour gérer si l'utilisateur est connecté
  useEffect(() => {
    if (account.isLogged()) {
      setUser(true);
    }
  }, [])

  // Fonction qui renvoie le pathname de la page courante
  function getLocation() {
    setLocation(document.location.pathname);
  }

  // Le useEffect ici gère la récupéartion de l'url pour l'accessibilité du menu mais aussi pour savoir si le menu doit être rendu ou non.
  // Il ne doit pas l'être pour la page de désinscription
  useEffect(() => {
    getLocation()
  }, [locationChanged]);

    // Si mon url contient unsubscribed je rend la page de désinscription et pas le menu
  if(location.includes('/unsubscribed')) {
    return (
      <Unsubscribed/>
    )
  } else {
    // Sinon je rend le menu et les affichahes connexes.
    return (
      <BrowserRouter>
        <Header location={location} handleChangeLocation={handleChangeLocation} listCampaign={listCampaign} user={user} setUser={setUser} />

        <main id='main' role="main">
          <BreadCrumb handleChangeLocation={handleChangeLocation}/>
          <Routes>
            {user && <Route path="/" element={<Guard setUser={setUser} ><Homepage listCampaign={listCampaign} getLocation={getLocation}/></Guard>} />}
            <Route path="/creation" element={<Guard><CreateCampaign /></Guard>} />
            <Route path="/liste" element={<Guard><ListCampaign listCampaign={listCampaign} fetchCampaignList={fetchCampaignList} getLocation={getLocation}/></Guard>} />
            <Route path="/liste/detail/:currentId" element={<Guard><DetailsCampaign fetchCampaignList={fetchCampaignList}/></Guard>} />
            <Route path="/liste/detail/:currentId/statistic" element={<Guard><Statistic listCampaign={listCampaign}/></Guard>} />
            {!user && <Route path="/" element={<Login setUser={setUser} />} />}
            {!user && <Route path="/signup" element={<Signup setUser={setUser} />} />}
            <Route path="/liste/detail/:idCampaign/contacts" element={<Guard><HandleContact listCampaign={listCampaign} /></Guard>} />
            <Route path="/liste/detail/:idCampaign/contacts/creationContact" element={<Guard><AddContact listCampaign={listCampaign}/></Guard>} />
            <Route path="/liste/detail/:idCampaign/contacts/invalidContact/:nameFile" element={<Guard><InvalidContact /></Guard>} />
            <Route path="/liste/detail/:idCampaign/creationMailing" element={<Guard><CreateMailing listCampaign={listCampaign} /></Guard>} />
            <Route path="/liste/detail/:currentId/verifierMailing" element={<Guard><MailingVerification /></Guard>} />
            <Route path="/plan" element={<Guard><Sitemap location={location} handleChangeLocation={handleChangeLocation} listCampaign={listCampaign} setUser={setUser}/></Guard>}/>
            <Route path="/unsubscribed/:token" element={<Unsubscribed />} />
            <Route path="*" element={<NotFound user={user} />} />
          </Routes>
        </main>
        <Footer location={location} />
      </BrowserRouter>
    )
  }
}
export default App;