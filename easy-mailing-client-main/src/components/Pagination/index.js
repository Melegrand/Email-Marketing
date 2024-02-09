import React from 'react';
import './index.scss';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    // Calcul du nombre total de pages en fonction du nombre total d'éléments et du nombre d'éléments par page
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // Nombre de pages visibles à afficher
    const visiblePages = 5;
    // Demi du nombre de pages visibles
    const halfVisible = Math.floor(visiblePages / 2);
    // Calcul de la valeur minimale (min) pour la première page à afficher
    const min = Math.max(1, currentPage - halfVisible);
    // Calcul de la valeur maximale (max) pour la dernière page à afficher
    const max = Math.min(min + visiblePages - 1, totalPages);
    // Fonction pour afficher les numéros de page
    const renderPageNumbers = () => {
    // Création d'un tableau pour stocker les numéros de page à afficher
    const pageNumbersToShow = [];
    for (let i = min; i <= max; i++) {
      pageNumbersToShow.push(i);
    }

    return (
        <nav role='navigation' aria-label='Pagination liste des campagnes'>
            <ul className="pagination">
                {currentPage > 1 && (
                // Boutons pour aller à la première page et à la page précédente
                <>
                    <li><button onClick={() => onPageChange(1)}  aria-label={'Première page'}>&laquo;</button></li>
                    <li><button onClick={() => onPageChange(currentPage - 1)}  aria-label={'Page : ' + (currentPage - 1)}>&lsaquo;</button></li>
                </>
                )}

                {pageNumbersToShow[0] > 1 && (
                    // Affichage de "..." si nécessaire
                    <span>...</span>
                )}

                {pageNumbersToShow.map((number) => (
                    // Boutons pour les numéros de page
                    pageNumbersToShow.length > 1 &&
                    <li key={number}><button
                        className={number === currentPage ? 'current-page' : ''}
                        onClick={() => onPageChange(number)}
                        aria-label={'Page : ' + currentPage}
                        aria-current={number === currentPage ? 'page' : null}
                    >
                    {number}
                    </button></li>
                    
                ))}

                {pageNumbersToShow[visiblePages - 1] < totalPages && (
                    // Affichage de "..." si nécessaire
                    <li><span>...</span></li>
                )}

                {currentPage < totalPages && (
                    // Boutons pour aller à la page suivante et à la dernière page
                    <>
                        <li><button onClick={() => onPageChange(currentPage + 1)} aria-label={'Page : ' + (currentPage + 1)}>&rsaquo;</button></li>
                        <li><button onClick={() => onPageChange(totalPages)}  aria-label={'Dernière page : ' + totalPages}>&raquo;</button></li>
                    </>
                )}
            </ul>
        </nav>
      );
  };
  return renderPageNumbers();
}

export default Pagination;
