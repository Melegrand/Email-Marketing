import React, { useEffect, useState } from 'react';
import CampaignElement from './CampaignElement';
import Campaign from '../CampaignModel.js';
import './index.scss';
import Pagination from '../../Pagination';


function CalendarList({ listCampaign, setChange, change, searchMonth, setSearchMonth }) {
  // State qui gère les évènements du calendrier
  const [eventListMonth, setEventListMonth] = useState([]);
    // State qui gère la page actuelle de la pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State qui gère le nombre d'éléments par page 
  const [itemsPerPage, setItemsPerPage] = useState(10); 

    // Calcul de l'indice de départ pour les éléments actuellement affichés sur la page
    const startIndex = (currentPage - 1) * itemsPerPage;
    // Calcul de l'indice de fin pour les éléments actuellement affichés sur la page
    const endIndex = startIndex + itemsPerPage;
    // Extraction des campagnes actuellement affichées sur la page en fonction des indices de départ et de fin
    const currentCampaigns = eventListMonth.slice(startIndex, endIndex);

  // Fonction qui permet de récupérer le nombre de campagnes selon leur statut
  function getInformations(status) {
    const informations = eventListMonth.filter((campaign) => {
      return campaign.status === status
    })
    return informations.length
  }

  useEffect(() => {
    // Je récupère mes datas passées en props et je les filtres selon le mois et l'année recherché
    if(listCampaign.length > 0) {
      const eventListData = listCampaign?.filter((campaign) => {
      const start = new Date(campaign.startCampaign);
      const end = new Date(campaign.endCampaign);
    
    //   Mon filtre return que les campagnes correspondantes au mois et l'annee recherchée
      return start.getMonth()+1 <= searchMonth.getMonth() + 1 && 
      end.getMonth()+1 >= searchMonth.getMonth() + 1 && 
      start.getFullYear() <= searchMonth.getFullYear() && 
      end.getFullYear() >= searchMonth.getFullYear();
    // Je map ensuite les campagnes avec ma classe Campagne qui formate les données comme dans le calendrier
    }).map((campaign) => {
      return new Campaign(campaign.id, campaign.nameCampaign, campaign.startCampaign, campaign.endCampaign);
    });
    // Je mets à jour le state de mes campagnes avec cette nouvelle liste
    setEventListMonth(eventListData);
    // Je remets sur la première page d'affichage
    setCurrentPage(1)
    // Mon useEffect se déclenche se déclenche au chargement avec la date du jour et est rappelé à chaque changement de date lié au clic des boutons
    }
  }, [listCampaign, searchMonth]);

  return (
    <div className='list'>
      <h2 className='list__title'>Liste des campagnes : {eventListMonth.length}</h2>
      <div className='list__informations'>
          <p className='list__informations__element'>Terminée{getInformations('Terminée') > 1 && 's'} :  {getInformations('Terminée')}</p>
          <p className='list__informations__element'>En cours : {getInformations('En cours')}</p>
          <p className='list__informations__element'>Programmée{getInformations('Programmée') > 1 && 's'} : {getInformations('Programmée')}</p>
      </div>
      
      <ul className='list__campaign__container'>
          <div className="list__campaign__container__detail">
              {currentCampaigns.map((campaign) => {
                return <CampaignElement name={campaign.name} title={campaign.title} id={campaign.id} key={campaign.id} className={campaign.className}/>;
              })}
          </div>
          <Pagination className='list__campaign__container__pagination'
              totalItems={eventListMonth.length}
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage}
          />
      </ul>
    </div>
  );
}

export default CalendarList;
