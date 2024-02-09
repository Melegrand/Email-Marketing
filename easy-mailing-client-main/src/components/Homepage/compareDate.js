// Fonction qui définit le statut d'une campagne selon ses dates. Elle prend en paramètre la date de début et le date de fin.
function compareDate (date1, date2) {
    let result;
    const dateStartOnDate = new Date(date1)
    dateStartOnDate.setHours(1)
    const dateStart = dateStartOnDate.getTime()

    const dateEndOnDate = new Date (date2)
    dateEndOnDate.setHours(23)
    const dateEnd = dateEndOnDate.getTime()

    const today = new Date().getTime();

    if (dateStart > today) {
      result = 'programmed'
    } else if (dateStart <= today && dateEnd >= today) {
      result = 'current'
    } else if (dateEnd < today) {
      result = 'past'
    }

    return result
  }


  export default compareDate