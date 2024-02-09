import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Campaign from '../CampaignModel.js';
import './index.scss';


function Calendar({listCampaign, change}) {
  // State qui gère les évènements du calendrier
  const [eventList, setEventList] = useState([]);
  // Référence au composant FullCalendar
  const calendarRef = useRef(null);
    // Utilisez useRef pour stocker la valeur précédente de `change`
  const prevChange = useRef(change);
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
    const id= event.event._def.publicId
    // Je redirige sur le détail de la campagne en question
    viewDetail(id) 
  };

  // Fonction qui gère le rendu des events
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <h4 className='campaign__title'>{eventInfo.event.title}</h4>
      </>
    );
  };

  // A chaque chargement de la page ou si le state de la liste d'events change, mon composant est rappelé et reconstruit avec
  // les datas actuelles
  useEffect(() => {
    // Je récupère mes datas passées en props et je les formate avec ma classe.
    if(listCampaign.length > 0) {
    const eventListData = listCampaign?.map((campaign) => {
      return new Campaign(campaign.id, campaign.nameCampaign, new Date (campaign.startCampaign), new Date(campaign.endCampaign));
    });
    // Je mets à jour le state avec cette nouvelle liste
    setEventList(eventListData);
  }
  }, [listCampaign]); 


  useEffect(() => {
    // Vérifie si calendarRef.current existe
    if (calendarRef.current) {
      // Obtient l'API du calendrier depuis la référence
      const calendarApi = calendarRef.current.getApi();
      
      // Vérifie si la valeur de `change` a changé par rapport à sa valeur précédente
      if (change !== prevChange.current) {
        // Si `change` a changé, effectue la navigation vers le mois suivant du calendrier
        const action = change.action;
        // Selon l'action j'appelle la fonction correspondante
        if (action === 'next') {
          calendarApi.next();
        } else if (action === 'previous') {
          calendarApi.prev();
        } else if (action === 'now') {
          calendarApi.today();
        }
      }
      // Met à jour la valeur précédente de `change` pour la prochaine comparaison
      prevChange.current = change;
    }
  }, [change]);
  
  return (
    <div className='demo-app-main' aria-hidden="true">
      {/* Je gère les différentes propriétés et fonctions à renseigner pour paramétrer le calendrier */}
      <FullCalendar ref={calendarRef}

        headerToolbar={ {
          left: '',
          right: ''
        }}

        // Enlève les events tabulables 
        eventDidMount={function (arg) {
          const eventElement = arg.el;
            eventElement.setAttribute('tabindex', '-1');
        }}

        // Enlève les liens view more tabulables
        moreLinkDidMount ={function (arg) {
          const eventElement = arg.el;{
            eventElement.setAttribute('tabindex', '-1');
          }
        }}
        
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        // Définit le type de vue /jour/semaine/mois
        initialView='dayGridMonth'
        // Définit si le calendrier est éditable ou non
        editable={false}
        // Définit si le calendrier est sélectionnable ou non
        selectable={false}
        // Nombre d'évènements max affichés 
        dayMaxEvents={5}
        // Afficher ou non les weekends
        weekends={true}
        // Définit la liste d'évènements
        events={eventList}
        select={false}
        // Définit le contenu d'un évènement
        eventContent={renderEventContent}
        // Définti l'action au clic sur un event
        eventClick={handleEventClick}
        // Définit la timezone
        timeZone={'local'}
        // Défint le jour de la semaine où elle débute
        firstDay={0}
        // Définit la langue locale
        locale={'frLocale'} 
        // Définit si les events sont interractifs
        eventInteractive={true}
        aspectRatio = {1}
        handleWindowResize={true}
        height={'auto'}
      />
    </div>
  );
}

export default Calendar;

