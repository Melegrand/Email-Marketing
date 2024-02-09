import './index.scss'
import CalendarElement from './CalendarElement'
import CalendarLegend from './CalendarLegend';
import CalendarList from './CalendarList';
import CalendarHeader from './CalendarHeader';
import { useEffect, useState } from 'react';

const Homepage = ({listCampaign, getLocation}) => {
  const [change, setChange] = useState(false);
  const now = new Date();
//   State qui gère le mois et l'année sélectionnée
  const [searchMonth, setSearchMonth] = useState(now); 

  document.title = 'Accueil'

  useEffect(() => {
    getLocation()
  })
  return (
    <section className='home'>
      <section>
        <CalendarHeader change={change} setChange={setChange} searchMonth={searchMonth} setSearchMonth={setSearchMonth}/>
      </section>
      <section className='home__calendar'>
        <CalendarList listCampaign={listCampaign} setChange={setChange} change={change} searchMonth={searchMonth} setSearchMonth={setSearchMonth}/>
        <CalendarElement listCampaign={listCampaign} setChange={setChange} change={change}/>
      </section>
      <section>
        <CalendarLegend/>
      </section>
    </section>
  );
}

export default Homepage;

