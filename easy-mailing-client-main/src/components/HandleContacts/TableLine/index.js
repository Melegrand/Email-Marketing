import React, { useEffect } from 'react';
import dateFormat from 'dateformat';

const TableLine = ({ contact, setDeleteList, setNameList, i, setConfirmDeleteIndex, confirmDeleteIndex, isCancel, setIsCancel, titleList }) => {
  // Cette fonction est appelée lorsque l'utilisateur clique sur le bouton "Supprimer"
  const handleDeleteClick = (i, e) => {
    // Affiche le bouton "Confirmer" pour la ligne cliquée
    setConfirmDeleteIndex(i);
    // Appelle les fonctions pour définir les valeurs à supprimer
    setDeleteList(contact.idList);
    setNameList(contact.nameFile);
  }

  // Au clic sur annuler, je remet la confirmation a null et je met isCancel a true 
  const handleCancelClick = () => {
    setConfirmDeleteIndex(null);
    setIsCancel(true)
  }

  useEffect(() => {
    // Si j'ai cliqué sur supprimer je met le focus sur le bouton de confirmation
    if (confirmDeleteIndex === i) {
      document.getElementById(`btnConfSupp${i}`).focus()
    }
    // Si je clique sur annuler, je mets le focus sur le titre du tableau
    if(isCancel) {
      titleList.current.focus()
      setIsCancel(false)
    }
}, [confirmDeleteIndex])

  return (
      <tr>
          <td>
              {contact.nameFile === "no list" ? "Contact" : "Liste"}
          </td>
          <td>
              {contact.nameFile === "no list" ? contact.emailContact : contact.nameFile}
          </td>
          <td>
              {dateFormat(contact.createdDate, "dd/mm/yyyy")}
          </td>
          <td>
              {confirmDeleteIndex === i ? ( // Vérifie si la ligne actuelle est en mode de confirmation
                  <span>
                    <button type="submit" tabIndex='1' aria-label={'Confirmer la suppression de ' + contact.nameFile} id={`btnConfSupp${i}`}>
                        Confirmer
                    </button>
                    <button type="button" tabIndex='2' onClick={() => handleCancelClick(i)} aria-label={'Annuler la supression de ' + contact.nameFile} >
                        Annuler
                    </button>
                  </span>
              ) : (
                    <button type="button" onClick={() => handleDeleteClick(i)} aria-label={'Supprimer ' + contact.nameFile} >
                        Supprimer
                    </button>
              )}
          </td>
      </tr>
  );
}

export default TableLine;