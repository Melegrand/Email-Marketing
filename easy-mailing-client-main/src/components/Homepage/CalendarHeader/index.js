import './index.scss'

const Homepage = ({setChange, change, searchMonth, setSearchMonth}) => {
  //   Liste de référence des mois 
  const monthList = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  function getAdjacentMonth(previousOrNextOrNow) {
    // Je définit la date du mois en court de recherche grâce au state searchMonth
    const adjacentMonth = new Date(searchMonth);

    // Selon la demande de l'utilisateur, je détermine le mois à renvoyer
    if (previousOrNextOrNow === 'next') {
      console.log(adjacentMonth.getMonth() + 1)

      adjacentMonth.setMonth(adjacentMonth.getMonth() + 1);
    } else if (previousOrNextOrNow === 'previous') {
      adjacentMonth.setMonth(adjacentMonth.getMonth() - 1);
    } else if (previousOrNextOrNow === 'now') {
        adjacentMonth.setMonth(new Date().getMonth());
        // Pour le ramener au mois courant j'utilise l'année pour le faire correspondre en plus du mois
        adjacentMonth.setFullYear(new Date().getFullYear());
    }

    return adjacentMonth;
  }

  //   Fonction qui gère le clic des boutons
  const handleBtn = (event) => {
    // Je récupère l'id des boutons qui valent precedent, suivant ou actuel
    const previousOrNextOrNow = event.target.id;
    // J'appelle ma fonction adjacentMonth pour déterminer le mois à afficher
    const adjacentMonth = getAdjacentMonth(previousOrNextOrNow);
    // Je mets mon state de recherche à jour avec le mois recherché
    setSearchMonth(adjacentMonth);
    setChange( {state : change ? false : true, action: previousOrNextOrNow})
  }

  return (
    <div className='list__btns'>
        <h1 className='list__btns__month'>{monthList[searchMonth.getMonth()]} {searchMonth.getFullYear()}</h1>

        <div className='list__btns__container'>
            <button aria-label={
              `Voir ${monthList[searchMonth.getMonth() - 1] || 
                monthList[11]} ${searchMonth.getMonth() === 0 ?
                searchMonth.getFullYear() - 1 : searchMonth.getFullYear()}`
              }
                id='previous' onClick={handleBtn} className='list__btns__container__btn ample'>&lsaquo;</button>
            <button id='now' onClick={handleBtn} className='list__btns__container__btn'>Mois courant</button>
            <button aria-label={
              `Voir ${monthList[searchMonth.getMonth() + 1] || 
                monthList[0]} ${searchMonth.getMonth() === 11 ? 
                searchMonth.getFullYear() + 1 : searchMonth.getFullYear()}`}
                id='next' onClick={handleBtn} className='list__btns__container__btn ample'>&rsaquo;</button>
        </div>
    </div>
  );
}

export default Homepage;

