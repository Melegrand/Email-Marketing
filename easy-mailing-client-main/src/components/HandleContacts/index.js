import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import HeaderSection from '../HeaderSection';
import Papa from 'papaparse';
import './index.scss';
import account from '../../auth/utils';
import { Link } from 'react-router-dom';
import TableLine from './TableLine';
import React from 'react';
import * as dotenv from 'dotenv';
dotenv.config();

const HandleContact = ({listCampaign}) => {
    const {idCampaign} = useParams();
    // State de l'objet campagne qui permet de gérer si elle a déjà été envoyée ou non
    const [campaign, setCampaign] = useState({sent: true});
    // State qui geree le fichier csv
    const [csvFile, setCSVFile] = useState({});
    // State qui gère l'erreur de format du fichier
    const [errorFileFormat, setErrorFileFormat] = useState(false);
    // State qui gère si le fichier est vide
    const [errorEmptyFile, setErrorEmptyFile] = useState(false);
    // State qui gère si le nom du fichier est vide
    const [errorEmptyName, setErrorEmptyName] = useState(false);
    // State qui gère si il ya un fichier
    const [existFile, setExistFile] = useState(false);
    // State qui gère si l'action d'ajout de fichier a été déclenchée
    const [changeAddFile, setChangeAddFile] = useState(false);
    // State qui gère si l'ajout de liste a réussit
    const [isAdded, setIsAdded] = useState(false);
    // State qui gère si la supression a réssit
    const [successDelete, setSuccessDelete] = useState(false);
    // State qui gère si il ya une erreur dans la suppression
    const [errorDelete, setErrorDelete] = useState(false);
    // State qui gère si l'action de suppression a été déclenchée
    const [changeDelete, setChangeDelete] = useState(false);
    // State qui gère le nombre de contact invalide
    const [numberInvalidContact, setNumberInvalidContact] = useState(0);
    // State qui gère si toute la liste de contact est invalide
    const [fullInvalidContact, setFullInvalidContact] = useState(false);
    // State qui gere l'état d'ajout de liste pour gérer les fous et messages à afficher
    const [responseServorAdd, setResponseServorAdd] = useState(false);
    // State qui gere si l réponse serveur est ok
    const [responseOk, setResponseOk] = useState(false);
    //  Statequi gère l'id de liste à supprimer
    const [deleteList, setDeleteList] = useState();
    // State qui gère le nom de liste à supprimer
    const [nameList, setNameList] = useState();
    // State qui gère l'affichage des listes
    const [contactList, setContactList] = useState([]);
    // State qui gère l'index dans la liste des fichiers affichés
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
    // State qui gère qi l'utilisateur a annulé la supression
    const[isCancel, setIsCancel] = useState(false)

    // Différentes références aux éléments html
    const isAddedMsg = useRef(null);
    const inputImportFile = useRef(null);
    const titleList = useRef(null);
    const titleImportFile = useRef(null);
    const invalidContactLink = useRef(null);
    // Cette réfrence utilise le state de l'ajout de fichier
    const changeAddFileRef = useRef(changeAddFile);

    document.title = `Gestion des contacts ${
        errorFileFormat
        || errorEmptyFile
        || errorEmptyName
        || existFile
        || fullInvalidContact
        || errorDelete ? 'erreur' : ''
    }`

    // Fonction qui reset tous les states d'erreur et de réussites liés à l'ajout de liste
    function resetErrorStateAdd() {
        setErrorFileFormat(false);
        setErrorEmptyFile(false);
        setIsAdded(false);
        setErrorEmptyName(false);
        setExistFile(false);
        setNumberInvalidContact(0);
        setFullInvalidContact(false)
        setResponseServorAdd(false);
        setResponseOk(false);
    }

    // Fonction qui reset tous les states d'erreur et de réussites liés à la suppression de liste
    function resetErrorStateDelete() {
        setErrorDelete(false);
        setSuccessDelete(false);
        setConfirmDeleteIndex(null);
        setIsCancel(false)
    }

    // Fonction qui actualise le state contactList 
    const fetchContactList = async () => {

        const response = await fetch(`${process.env.URL_API}/api/contactList/${idCampaign}`, account.fetchOptionsGet());
        const data = await response.json();
        setContactList(data);
    }

    // suppresion de doublon de contact pour ne garder que les listes
    const listCampaignNameWithoutDuplicate = contactList.filter((objet, index, self) => {
        const firstIndex = self.findIndex((o) => o.idList === objet.idList);
        return index === firstIndex;
    });
        
    // Fonction qui actualise le state CSVFile au changement sur l'input
    const handleFileChange = (event) => {
        resetErrorStateAdd()
        const file = event.target.files[0];
        try {
            file && Papa.parse(file, {
                header: true,
                complete: (results) => {
                    // Pour récupérer le nom du fichier, on créer un objet avec les informations du fichier et on y ajoute le nom du fichier sans l'extension ".csv"
                    setCSVFile(
                        {
                            contact: results.data, 
                            nameFile: event.target.files[0].name.replace(".csv", ""),
                            nameFull: event.target.files[0].name,
                            idCampaign: idCampaign
                        }
                    );
                },
                error: (error) => {
                    console.error(error.message);
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    // A la validation du fichier je vais vérifier si il y a une erreur
    const onSubmitFile = async (event) => {
        // Je reset mes states
        resetErrorStateAdd()
        resetErrorStateDelete()
        event.preventDefault();

        // Je vérifie qu'il ya un fichier importé sinon je jette une erreur
        if(Object.keys(csvFile).length !== 0){
            // Je verifie si le format du fichier est correct sinon je jette une erreur
            csvFile.nameFull.substr(-4) !== ".csv" ? setErrorFileFormat(true) : setErrorFileFormat(false);
            // Je verifie si le nom du fichier est vide sinon je jette une erreur
            csvFile.nameFile === "" ? setErrorEmptyName(true) : setErrorEmptyName(false);
            // Je verifie si le nom du fichier n'existe pas déjà sinon je jette une erreur
            const propertyExists = listCampaignNameWithoutDuplicate.some(item => item.nameFile === csvFile.nameFile);
            propertyExists ? setExistFile(true) : setExistFile(false);
        } else {
            setErrorEmptyFile(true)
        } 
        // J'actualise mon state de changement
        setChangeAddFile(changeAddFile ? false : true);
    };

    // Fonction qui reset les staes et l'input de fichier
    const handleResetFile = () => {
        resetErrorStateAdd()
        resetErrorStateDelete()
        setCSVFile({});
    }

    // Fonction qui supprime la liste de contact
    const handleDeleteList = async (e) => {
        resetErrorStateDelete()
        e.preventDefault();

        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account.getToken()}`
                },
            };
            const response = await fetch(`${process.env.URL_API}/api/deleteContactList/${idCampaign}/${deleteList}/${nameList}`, options);
            if (!response.ok) {
                // Si il ya un problème, je jette ue erreur 
                setErrorDelete(true);
                throw new Error('La réponse n\'est pas ok');
            } else {
                // Sinon ça a réussi j'affiche un message de succès
                setSuccessDelete(true);
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la suppression :', error);
        }
        // J'actualise mon satte de changement
        setChangeDelete(changeDelete ? false : true);
    };

    // au chargement de la page je récupère l'objet de la campagne en cours, ce qui permettra d'afficher le contenu ou non selon si la campagne est envoyée
    useEffect(() => {
        if (listCampaign && listCampaign.length > 0) {
            const campaignList = listCampaign.filter(campaign => campaign.id === parseInt(idCampaign));
            if (campaignList.length > 0) {
                setCampaign(campaignList[0]);
            }
        }
    }, [listCampaign]);
    
    // useEffect qui gère les redirection de focus, l'actualisation de la liste et la suppression des messages d'erreur passés
    useEffect(() => {
        fetchContactList();
        if(successDelete){
            resetErrorStateAdd()
        }

        if(errorDelete || successDelete) {
            titleList.current.focus();
        }

        if(isAdded){
            titleImportFile.current.focus();
        }
    }, [isAdded, changeDelete]);

    // useEffect qui gère l'ajout du fichier
    useEffect(() => {
        // fonction qui ajoute le fichier et actualise le sate isAdded si il n'y a pas d'erreurs
        async function addFile() {
            try {
                if (!errorEmptyFile && !errorFileFormat && !errorEmptyName && !existFile) {
                    const response = await fetch(`${process.env.URL_API}/api/createContactList`, account.fetchOptionsPost(csvFile));
                    const data = await response.json();
                    setNumberInvalidContact(data);

                    if (!response.ok) {
                        throw new Error('La réponse serveur n\'est pas ok');
                    } else {
                        setResponseServorAdd( responseServorAdd ? false : true);
                        setResponseOk(true);
                    }
                } else {
                    // Si il ya un problème, je remets le focus sur l'input de fichier
                    inputImportFile.current.focus();
                }
            } catch (error) {
                console.error(error);
            }
        }
        // Vérifie si changeAddFileRef est différent de la valeur précédente
        if (changeAddFile !== changeAddFileRef.current) {
            // Met à jour la référence
            changeAddFileRef.current = changeAddFile;
            // Appele addFile()
            addFile();
        }
    }, [changeAddFile]);

    useEffect(() => {
        if (responseOk) {
            if(numberInvalidContact === csvFile.contact.length){
                setFullInvalidContact(true)
            } else {
                setIsAdded(true);

                if (numberInvalidContact > 0 && numberInvalidContact < csvFile.contact.length) {
                    invalidContactLink.current.focus()
                } 
            }
        }
    }, [responseServorAdd])

    return (
        <section className="section">
            <HeaderSection route={`/liste/detail/${idCampaign}`} title={"Gérer les contacts"} ariaLabel={"Retour page détails de la campagne"}/>
            {!campaign.sent ? 
            <section className="section__main subsection">
                <div className="section__main__add__contact">
                    <h2 className="section__main__add__contact__desc">Ajouter un contact manuellement</h2>
                    <Link to={`/liste/detail/${idCampaign}/contacts/creationContact`} className="link section__main__add__contact__link button" aria-label="Ajouter un contact manuellement">Ajouter</Link>
                </div>
                <div className="section__main__importFileContainer">
                    <form method='POST' onSubmit={onSubmitFile}>
                        <div>
                            <h2 className="section__main__importFileContainer__label" ref={titleImportFile} tabIndex='0'>Importer un fichier</h2>
                            <label htmlFor="importFile" id='describeFile'>Fichier au format CSV, données minimum: <span lang="en">civility, firstname, lastname, email</span> </label>
                            <input 
                                type="file" 
                                className="section__main__importFileContainer__file" 
                                name="importFile" 
                                id='importFile' 
                                onChange={handleFileChange} 
                                aria-invalid={errorEmptyFile || errorFileFormat || errorEmptyName || existFile ? true : null}
                                aria-labelledby='describeTypeFile describeFile'         
                                aria-required='true' 
                                ref={inputImportFile}
                            ></input>  
                            {errorEmptyFile && <p role='alert'  id="errorEmptyFile" className="section__main__importFileContainer__textValidation important"> Veuillez sélectionner un fichier à ajouter</p>}
                            {errorEmptyName && <p role='alert'  id="errorEmptyName" className="section__main__importFileContainer__textValidation important"> Le nom du fichier ne peut pas être vide</p>}
                            {errorFileFormat && <p role='alert'  id="errorFileFormat" className="section__main__importFileContainer__textValidation important"> Veuillez sélectionner un fichier au format .csv</p>}
                            {existFile && <p role='alert'  id="existFile" className="section__main__importFileContainer__textValidation important">Le nom de fichier est déjà existant dans les fichiers ajoutés</p>}
                            {isAdded && <p role='alert' id="isAdded" className="section__main__importFileContainer__textValidation success" ref={isAddedMsg} tabIndex='0'>Le fichier <span>{csvFile.nameFile}</span> a bien été ajouté à la liste de contacts</p>}
                            {fullInvalidContact && <p role='alert' id="fullInvalidContact" className="section__main__importFileContainer__textValidation important">L'ensemble des contacts du fichier est invalide, le fichier n'a donc pas été ajouté</p>}
                            {numberInvalidContact > 0 && numberInvalidContact < csvFile.contact.length && <Link role='alert' to={`/liste/detail/${idCampaign}/contacts/invalidContact/${csvFile.nameFile}`} ref={invalidContactLink} tabIndex='0' className="section__main__importFileContainer__textValidation important">Attention, il y a {numberInvalidContact} contacts invalides dans votre liste, cliquez pour voir le détail</Link>}

                        </div>
                        <div className="section__main__importFileContainer__buttonContainer">
                            <input type="reset" value="Réinitialiser" className="section__main__importFileContainer__buttonContainer__reset button" onClick={handleResetFile}/>
                            <input type="submit" value="Valider" className="section__main__importFileContainer__buttonContainer__submit button"/>
                        </div>
                    </form>
                    <form method='DELETE' onSubmit={handleDeleteList}>
                        <h2 ref={titleList} tabIndex='0'>Liste des contacts et des listes de contacts ajoutés</h2>
                        {successDelete && <p tabIndex='0' className='success' id='successDelete' role='alert'>La liste ou le contact a bien été supprimé</p>}
                        {errorDelete && <p tabIndex='0' className='important' id='errorDelete' role='alert'>Un problème est survenue, la liste ou le contact n'a pas pu être supprimé</p>}
                        <div className="container__table__contact">
                            <table role="présentation" className='table'>
                                <caption>Types, noms et boutons de suppression des contacts et listes de contacts.</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Type</th>
                                        <th scope="col">Nom de fichier ou email</th>
                                        <th scope="col">Date de création</th>
                                        <th scope="col">Supprimer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCampaignNameWithoutDuplicate.length > 0 ? listCampaignNameWithoutDuplicate.map((contact, i) => (
                                        <TableLine
                                            contact={contact}
                                            i={i}
                                            setDeleteList={setDeleteList}
                                            setNameList={setNameList}
                                            setConfirmDeleteIndex={setConfirmDeleteIndex}
                                            confirmDeleteIndex={confirmDeleteIndex}
                                            key={i}
                                            isCancel={isCancel}
                                            setIsCancel={setIsCancel}
                                            titleList={titleList}
                                            />
                                    )) : <tr>
                                            <td colSpan="4" className='empty'>Aucun contact</td>
                                    </tr>}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </section> : <p>L'accès à cette page n'est pas autorisé si la campagne a été envoyée</p>}
        </section>
    )
}

export default HandleContact;
