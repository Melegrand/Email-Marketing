import './index.scss';

// Composant qui défini la légende du calendrier
const CalendarLegend = () => {
  return (
    <div className='legend' >
        <div className='legend__container' aria-hidden="true">
            <h2 className='legend__container__element'>Légende : </h2>
            <div className='legend__container__element'><span className='legend__container__color past'></span>Terminée</div>
            <div className='legend__container__element'><span className='legend__container__color current'></span>En cours</div>
            <div className='legend__container__element'><span className='legend__container__color programmed'></span>Programmée</div> 
        </div>
    </div>
  );
}

export default CalendarLegend;