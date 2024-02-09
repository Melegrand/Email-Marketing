import client from '../database.js';
import DeleteContactList from '../models/DeleteContactList.js';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import validator from 'validator';
import * as fs from 'node:fs/promises';
import Contact from '../models/Contact.js';
dotenv.config(); 


const contactController = {

    createContactList: async function(req, res) {
        try {
            const result = req.body;
            const requestLastNbList = await client.query(`SELECT * FROM "campaign_has_contact" WHERE "idCampaign" = $1 ORDER BY "idList" DESC LIMIT 1`, 
            [result.idCampaign]);
            let lastIdList
            requestLastNbList.rowCount > 0 ? lastIdList = requestLastNbList.rows[0].idList : lastIdList = 0
            lastIdList = lastIdList + 1;
            let newContact = 0;
            
            const invalidContact = [];
            
            for (let index = 0; index < result.contact.length; index++) {
                // Vérirification de la validité de chaque contact avant de l'importer dans la table
                if (result.contact[index].email && 
                    result.contact[index].civility && 
                    result.contact[index].firstname && 
                    result.contact[index].lastname && 
                    validator.isEmail(result.contact[index].email) && 
                    result.contact[index].email !== "") {
                    // Vérification si un des contact est deja rentré dans la table campaign_has_contact en etant désinscrit
                    const requestIsUnsubscribed = await client.query(`SELECT * FROM "campaign_has_contact" 
                    WHERE "emailContact" = $1 AND "unsubscribed" = $2`, 
                    [result.contact[index].email, true]);
                    // Si un résultat est trouvé on passe dans le if sinon on passe dans le else
                    if (requestIsUnsubscribed.rowCount > 0) {
                        // Verification si le contact est déjà rentré dans la table contact_unsubscribed avec le meme id de campagne
                        const requestExist = await client.query(`SELECT * FROM "contact_unsubscribed" 
                        WHERE "emailContact" = $1 AND "idCampaign" = $2`, 
                        [result.contact[index].email, result.idCampaign]);
                        // Si aucun résultat n'est trouvé on ajoute le contact dans la table contact_unsubscribed
                        if (requestExist.rowCount == 0) {
                            const requestInsert = `INSERT INTO "contact_unsubscribed" 
                            ("idCampaign", "idCampaignUnsubscribed", "emailContact", "nameFile", "unsubscribed") 
                            VALUES ($1, $2, $3, $4, $5);`;
                            const valuesInsert = [
                                result.idCampaign, 
                                requestIsUnsubscribed.rows[0].idCampaign, 
                                result.contact[index].email, 
                                result.nameFile, 
                                true];
                            await client.query(requestInsert, valuesInsert)
                        }
                    } else {
                        // Vérification si le contact est déjà inscrit dans la table campaign_has_contact avec le même id de campagne
                        const requestExist = await client.query(`SELECT * FROM "campaign_has_contact" 
                        WHERE "idCampaign" = $1 AND "emailContact" = $2`, 
                        [result.idCampaign, result.contact[index].email]);
                        // Si aucun résultat n'est trouvé on ajoute le contact dans la table campaign_has_contact puis on incrémente le nombre de contact pour mettre à jour le nombre de contact de la campagne
                        if (requestExist.rowCount == 0) {
                            const requestInsert = `INSERT INTO "campaign_has_contact" 
                            ("idCampaign", "emailContact", "idList", "nameFile", "sent", "unsubscribed", "openEmail") 
                            VALUES ($1, $2, $3, $4, $5, $6, $7);`;
                            const valuesInsert = [result.idCampaign, result.contact[index].email, lastIdList, result.nameFile, false, false, 0];
                            await client.query(requestInsert, valuesInsert)
                            newContact++
                        }
                    }
                    // Ajout ce contact seulement si il n'existe pas dans la table campagne
                    const requestContactExist = await client.query('SELECT * FROM "contact" WHERE "email" = $1', [result.contact[index].email]);
                    if (requestContactExist.rowCount == 0) {
                        const text = `INSERT INTO "contact" 
                        ("civility", "lastname", "firstname", "business", "email", "unsubscribedDate", "createdDate", "contactToken") 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
                        const values = [
                            result.contact[index].civility, 
                            result.contact[index].lastname, 
                            result.contact[index].firstname, 
                            result.contact[index].business, 
                            result.contact[index].email, 
                            null, 
                            new Date(), 
                            (`${process.env.START_KEY_TOKEN}${crypto.randomBytes(64).toString('hex')}${process.env.END_KEY_TOKEN}`)];
                        await client.query(text, values)
                    }
                } else {
                    invalidContact.push(result.contact[index])
                }
            }

            // Requête pour récupérer le nombre de contact de la campagne
            const requestNbrContact = await client.query('SELECT * FROM "campaign" WHERE "id" = $1', [result.idCampaign]);
            const newNbrContact = requestNbrContact.rows[0].nbrContact + newContact

            // Update du nombre de contact de la campagne à l'import de chaque liste de contact
            const updateNbrContact = `UPDATE "campaign" SET "nbrContact" = $1 WHERE "id" = $2;`;
            const valuesUdpate = [newNbrContact, result.idCampaign];
            await client.query(updateNbrContact, valuesUdpate)

            // Si j'ai des contacts invalides je les enregistre dans un fichier
            if(invalidContact.length > 0 && invalidContact.length != result.contact.length) {
                const jsonData = JSON.stringify(invalidContact);
                fs.writeFile(`invalidList/${result.idCampaign}-${result.nameFile}.json`, jsonData, function (err) { 
                    if (err) throw err; console.log('Fichier créé !');
                });
            }
            res.status(200).json(invalidContact.length);

        } catch (error) {
            console.error(error)
            res.status(406)
        }
    },

    invalidContact: async function(req, res) {
        // si j'ai des contacts invalides je vais chercher la liste 
        const idCampaign = req.params.idCampaign
        const nameList = req.params.nameList
        const filePath = `invalidList/${idCampaign}-${nameList}.json`;

        try {
            // je vérifie l'existence du fichier
            await fs.access(filePath);
            // Le fichier existe, on peut donc continuer avec la suppression du fichier, si il n'existe pas, on ne fait rien
            const data = await fs.readFile(filePath);
            res.send(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Le fichier n'existe pas, aucune action nécessaire.
                console.log('Le fichier n\'existe pas.');
            } 
            console.error(error)
        }
    },
    addContact: async function(req, res) {
        try {            
            const result = req.body;
            new Contact(result.civility, result.email, result.firstname, result.lastname, result.business, result.idCampaign)
            .addContact()

            res.send(result);
        } catch (error) {
            console.error(error)
            res.status(500).send('Erreur serveur')
        }
    },
    contactList: async function(req, res) {
        try {
            const contactRequest = await client.query('SELECT * FROM "campaign_has_contact" WHERE "idCampaign" = $1', [req.params.id]);
            const list = contactRequest.rows;
            res.send(list);
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },
    contactListUnsuscribed: async function(req, res) {
        try {
            const contactRequest = await client.query('SELECT * FROM "contact_unsubscribed" WHERE "idCampaign" = $1', [req.params.id]);
            const list = contactRequest.rows;
            res.send(list);
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },
    deleteContactList: async function(req, res) {
        try {
            const deleteContactList = new DeleteContactList(
                req.params.idCampaign,
                req.params.idList,
                req.params.nameList,
                client
            );
            deleteContactList
                .updateNbrContact()
                .then(() => {
                    return deleteContactList.deleteList();
                })
                .then((deletedList) => {
                    res.json(deletedList);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Une erreur s\'est produite.' });
                });
                
                // Si il y a une liste de contacts ivalides, je la supprime
                deleteContactList.deleteFileInvalidList()

        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },

    unsubscribedContact: async function(req, res) {
        try {
            // Je rajoute mes clefs au token pour le reformer entièrement et j'enlève les 128 premiers caracteres qui sont le token de campagne
            const token = `${process.env.START_KEY_TOKEN}${req.params.token.slice(128)}${process.env.END_KEY_TOKEN}`
            // Je fais ma requête pour verifier si le token existe en bdd
            const contactTokenRequest = await client.query('SELECT * FROM "contact" WHERE "contactToken" = $1', [token]);

            // Si il trouve un résultat
            if (contactTokenRequest.rowCount === 1) {
                // Je rajoute mes clefs au token pour le reformer entièrement et je récupère les deux premiers carctères uniquement, ils sont le token de la campagne
                const campaignToken =`${process.env.START_KEY_TOKEN}${req.params.token.substring(0, 128)}${process.env.END_KEY_TOKEN}`
                // Je récupère la date du jour
                const currentDate = new Date();
                // J'ajoute la date du jour à la colonne unsubscribedDate au contact en question
                const contactUnsubscribedRequest = await client.query(`UPDATE "contact" SET "unsubscribedDate" = $1 
                WHERE "contactToken" = $2`, [currentDate, token]);
                // Je vérifie si le contact est bien désinscrit
                const contactValidatedRequest = await client.query('SELECT * FROM "contact" WHERE "contactToken" = $1', [token]);
                // J'actualise dans la table de liaison campaigne_has_contact la désinscription du contact pour une campagne donc true
                const updateConnexionTable = await client.query (`UPDATE "campaign_has_contact" SET "unsubscribed" = $1 FROM "campaign" 
                WHERE "campaign_has_contact"."idCampaign" = "campaign"."id" 
                AND "campaign"."campaignToken" = $2 
                AND "campaign_has_contact"."emailContact" = $3`, [true, campaignToken, contactValidatedRequest.rows[0].email]);
                // Je vérifie si le contact est bien désisncrit dans la table de liaison
                const contactValidatedUnsuscribedCampaign = await client.query(`SELECT * FROM "campaign_has_contact" 
                JOIN "campaign" ON "campaign"."id" = "campaign_has_contact"."idCampaign" 
                WHERE "campaign_has_contact"."emailContact" = $1 
                AND "campaign"."campaignToken" = $2`, [contactValidatedRequest.rows[0].email, campaignToken]);
                // Si il est désinscrit (donc pas null en BDD car il a maintenant une date) et désinscrit dans la table de liaison (donc à true)
                if(contactValidatedRequest.rows[0].unsubscribedDate =! null && contactValidatedUnsuscribedCampaign.rows[0].unsubscribed === true) {
                    // Je renvoie à mon front true
                    res.json(true)
                } else {
                    // Sinon je renvoie à mon front false
                    res.json(false)
                }
            } else {
                // Sinon je renvoie à mon front false
                res.json(false)
                console.error(error)

            }
        } catch (error) {
            // je catch l'erreur
            res.status(500)
        }
    },

    subscribedContact: async function(req, res) {
        try {
            // Je rajoute mes clefs au token pour le reformer entièrement et j'enlève les 2 premiers caracteres qui sont le token de campagne
            const token = `${process.env.START_KEY_TOKEN}${req.params.token.slice(128)}${process.env.END_KEY_TOKEN}`
            // Je fais ma requête pour verifier si le token existe en bdd
            const contactTokenRequest = await client.query('SELECT * FROM "contact" WHERE "contactToken" = $1', [token]);
            // Si il trouve un résultat
            if (contactTokenRequest.rowCount === 1) {
                // Je rajoute mes clefs au token pour le reformer entièrement et je récupère les deux premiers carctères uniquement, ils sont le token de la campagne
                const campaignToken =`${process.env.START_KEY_TOKEN}${req.params.token.substring(0, 128)}${process.env.END_KEY_TOKEN}`
                // Je remet null à la colonne unsubscribedDate au contact en question
                const contactUnsubscribedRequest = await client.query('UPDATE "contact" SET "unsubscribedDate" = $1 WHERE "contactToken" = $2', [null, token]);
                // Je vérifie si le contact est bien réinscrit
                const contactValidatedRequest = await client.query('SELECT * FROM "contact" WHERE "contactToken" = $1', [token]);
                // J'actualise dans a table de liaison campaigne_has_contact la désinscription du contact pour une campagne donnée
                const updateConnexionTable = await client.query (`UPDATE "campaign_has_contact" SET "unsubscribed" = $1 FROM "campaign" 
                WHERE "campaign_has_contact"."idCampaign" = "campaign"."id" 
                AND "campaign"."campaignToken" = $2 
                AND "campaign_has_contact"."emailContact" = $3`, [false, campaignToken, contactValidatedRequest.rows[0].email]);
                // Je vérifie si le contact est bien désisncrit dans la table de liaison
                const contactValidatedUnsuscribedCampaign = await client.query(`SELECT * FROM "campaign_has_contact" 
                JOIN "campaign" ON "campaign"."id" = "campaign_has_contact"."idCampaign" 
                WHERE "campaign_has_contact"."emailContact" = $1 
                AND "campaign"."campaignToken" = $2`, [contactValidatedRequest.rows[0].email, campaignToken]);
                // Si il est réinscrit (donc pas de date en BDD car il est de nouveau null) et si réinscrit dans la table de liaison (donc à false)
                if(contactValidatedRequest.rows[0].unsubscribedDate === null && contactValidatedUnsuscribedCampaign.rows[0].unsubscribed === false) {
                    // Je renvoie à mon front true
                    res.json(true)
                } else {
                    // Sinon je renvoie à mon front false
                    res.json(false)
                }
            } else {
                // Sinon je renvoie à mon front false
                res.json(false)
            }
        } catch (error) {
            // je catch l'erreur
            console.error(error)
            res.status(500)
        }
    },
};
export default contactController;
