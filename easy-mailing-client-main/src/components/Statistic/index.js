import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import account from '../../auth/utils';
import HeaderSection from '../HeaderSection';
import './index.scss';
import account from '../../auth/utils';
import * as dotenv from 'dotenv';
dotenv.config();

function Statistic({listCampaign}) {
    // State de l'objet campagne qui permet de gérer si elle a déjà été envoyée ou non
    const [campaign, setCampaign] = useState({sent: true});
    // State qui gère les évènements du calendrier
    const [statistic, setStatistic] = useState({
      totalContact: 0,
      unsubscribedContact: 0,
      nbrOpening: 0
    });
    // State qui gère un état d'erreur
    const [error, setError] = useState(false);
    // Je récupère l'id de campagne en paramètre
    const { currentId } = useParams();

    document.title = `Statistiques de la campagne ${statistic.currentCampaign}`

    ChartJS.register(ArcElement, Tooltip, Legend);
  
    // Je requête mon api pour avoir mes données de statistiques. Je récupère le nombre total de contacts, 
    // le nombre de désabonnements et le nom de la campagne
    const fetchStatistic = async () => {
      const response = await fetch(`${process.env.URL_API}/api/statistic/${currentId}`, account.fetchOptionsGet());
      const data = await response.json();
      if(!data) {
          setError(true);
      } else {
        setStatistic(data);
      }
    }

    // Options du graphique, je désactive la légende cliquable
    const options = {
        plugins: {
          legend: {
            onClick: false, // Désactiver l'action de clic sur la légende
          },
          tooltip: { enabled: false }
        },
      };

    const data = {
    // Légende du graphique
      labels: [
        'Nombre total de contacts',
        'Nombre de désabonnements',
      ],
      datasets: [{
        // Données du graphique
        data: [(statistic.totalContact - statistic.unsubscribedContact), statistic.unsubscribedContact],
        // Couleurs du graphique
        backgroundColor: [
          '#2C6298',
          '#FCBC28',
        ],
      }]
    };

    const dataOpen = {
      // Légende du graphique
        labels: [
          'Nombre total de mails',
          "Nombre d'ouvertures de mails",
        ],
        datasets: [{
          // Données du graphique
          data: [(statistic.totalContact - statistic.nbrOpening), statistic.nbrOpening],
          // Couleurs du graphique
          backgroundColor: [
            '#2C6298',
            '#FCBC28',
          ],
          // hoverOffset: 4
        }]
    };

    // au chargement de la page je récupère l'objet de la campagne en cours, ce qui permettra d'afficher le contenu ou non selon si la campagne est envoyée
    useEffect(() => {
      if (listCampaign && listCampaign.length > 0) {
          const campaignList = listCampaign.filter(campaign => campaign.id === parseInt(currentId));
          if (campaignList.length > 0) {
              setCampaign(campaignList[0]);
          }
      }
    }, [listCampaign]);

    // Au chargement de la page j'appelle ma requête api des statistiques
    useEffect(() => {
      fetchStatistic();
    }, []);

    return (
      <section className='section'>
          <HeaderSection route={`/liste/detail/${currentId}`} title={'Statistiques de la campagne ' + statistic.currentCampaign} ariaLabel={"Retour page détails de la campagne"}/>
          <div className="subsection">
            {!campaign.sent ? (
                <p className="statistic__error important">L'accès à cette page n'est pas autorisé si la campagne ,n'a pas été envoyée</p>
            ) : (
                <div className='section__statistic'>
                    <p className='section__statistic__contactNbr'>{'Nombre de contact' + (statistic.totalContact > 0 ? 's' : '') + ' : ' + (statistic.totalContact)}</p>
                    <div className='section__statistic__component'>
                        <div className='section__statistic__component__container'>
                            <h3>Désabonnements</h3>
                            <p className='section__statistic__component__element'>{'Nombre de désabonnement' + (statistic.unsubscribedContact > 0 ? 's' : '') + ' : ' + (statistic.unsubscribedContact)}</p>
                            <p className='section__statistic__component__element'>{'Taux de désabonnement'+ (statistic.unsubscribedContact > 0 ? 's' : '') + ' : ' + ((statistic.totalContact > 0 ? (statistic.unsubscribedContact / statistic.totalContact) : 0) * 100).toFixed(2) + ' %'}</p>
                            <Pie data={data} options={options} className='section__statistic__component__unsubscribed__graphic__element'/>
                        </div>
                        <div className='section__statistic__component__container'>
                            <h3>Ouvertures</h3>
                            <p className='section__statistic__component__element'>{'Nombre d\'ouverture' + (statistic.nbrOpening > 0 ? 's' : '') + ' : ' + (statistic.nbrOpening)}</p>
                            <p className='section__statistic__component__element'>{'Taux d\'ouverture' + (statistic.nbrOpening > 0 ? 's' : '') + ' : ' + ((statistic.totalContact > 0 ? (statistic.nbrOpening / statistic.totalContact) : 0) * 100).toFixed(2) + ' %'}</p>
                            <Pie data={dataOpen} options={options} className='section__statistic__component__opened__graphic__element'/>
                        </div>
                    </div>
                </div>
            )}
          </div>
      </section>
    );
}

export default Statistic;
