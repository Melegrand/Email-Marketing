import React from 'react';
import { useNavigate } from "react-router-dom";
import './index.scss';


function CampaignElement({title, id, className, name}) {
      // J'utilise la fonction useNavigate de react pour gérer la redirection de page au clic ou au clavier sur une campagne
  const navigate = useNavigate(); 

  // Fonction qui gère la redirection sur la page détail de chaque campagne
  function viewDetail(id) {
    // Au clic ou au clavier, redirige sur la page détail en fonction de l'id de la campagne
    navigate(`/liste/detail/${id}`);
  }
    
      // Fonction appelé à chaque clic sur une campagne
      const handleEventClick = (event) => {
        // Je récuppère l'id de la campagne qui a été cliquée
        const id = event.target.dataset.id
        // Je redirige sur le détail de la campagne en question
        viewDetail(id) 
      };

  return (
    <li 
      aria-label={'Voir détail de ' + name} 
      tabIndex="0" 
      className={`current__campaign ${className}`} 
      data-id={id} 
      onClick={handleEventClick}>
        <a data-id={id} className="current__campaign__link">{title}</a>
    </li>
  );
}

export default CampaignElement;

