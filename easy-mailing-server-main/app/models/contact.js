import validator from "validator";
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import client from '../database.js';

dotenv.config(); 

class Contact {
    #civility;
    #email;
    #firstname;
    #lastname;
    #business;
    #idCampaign;

    constructor(civility, email, firstname, lastname, business, idCampaign) {
        this.civility = civility;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.business = business;
        this.idCampaign = idCampaign;
    }

    set civility(civility) {
        if (!validator.isLength(civility, { min: 1, max: 5 }) || validator.isEmpty(civility)) {
            throw new Error('erreur civility')
        } else {
            this.#civility = civility;
        }
    }

    set firstname(firstname) {
        if (!typeof(firstname) === 'string' || !validator.isLength(firstname, { min: 1, max: 100 })) {
            throw new Error('erreur firstname')
        } else {
            this.#firstname = firstname;
        }
    }

    set lastname(lastname) {
        if (!typeof(lastname) === 'string' || !validator.isLength(lastname, { min: 1, max: 100 })) {
            throw new Error('erreur lastname')
        } else {
            this.#lastname = lastname;
        }
    }

    set email(email) {
        if (!validator.isEmail(email) || validator.isEmpty(email)) {
            throw new Error('erreur email')
        } else {
            this.#email = email;
        }
    }
    set business(business) {
        if (!validator.isLength(business, { min: 0, max: 150 })) {
            throw new Error('erreur business')
        } else {
            this.#business = business;
        }
    }

    set idCampaign(idCampaign) {
        this.#idCampaign = idCampaign;
    }

    get civility() {
        return this.#civility
    }
    get business() {
        return this.#business
    }

    get email() {
        return this.#email
    }

    get firstname() {
        return this.#firstname
    }

    get lastname() {
        return this.#lastname
    }
    get idCampaign() {
        return this.#idCampaign
    }

    async addContact () {
        const requestLastNbList = await client.query(`SELECT * FROM "campaign_has_contact"
        WHERE "idCampaign" = $1 
        ORDER BY "idList" DESC LIMIT 1`, [this.idCampaign]);
        let lastIdList
        requestLastNbList.rowCount > 0 ? lastIdList = requestLastNbList.rows[0].idList : lastIdList = 0
        lastIdList = lastIdList + 1;
        let newContact = 0;

        const requestIsUnsubscribed = await client.query(`SELECT * FROM "campaign_has_contact" 
        WHERE "emailContact" = $1 
        AND "unsubscribed" = $2`, [this.email, true]);

        if (requestIsUnsubscribed.rowCount > 0) {
            // Verification si le contact est déjà inscrit dans la table contact_unsubscribed avec le meme id de campagne
            const requestExist = await client.query(`SELECT * FROM "contact_unsubscribed" 
            WHERE "emailContact" = $1 
            AND "idCampaign" = $2`, [this.email, this.idCampaign]);
            // Si aucun résultat est trouve on on ajoute le contact dans la table contact_unsubscribed
            if (requestExist.rowCount == 0) {
                const requestInsert = `INSERT INTO "contact_unsubscribed"
                ("idCampaign", "idCampaignUnsubscribed", "emailContact", "nameFile", "unsubscribed") 
                VALUES ($1, $2, $3, $4, $5);`;
                const valuesInsert = [this.idCampaign, requestIsUnsubscribed.rows[0].idCampaign, this.email, 'no list', true];
                await client.query(requestInsert, valuesInsert)
            }
        } else {
            // Verification si le contact est déjà inscrit dans la table campaign_has_contact avec le meme id de campagne
            const requestExist = await client.query(`SELECT * FROM "campaign_has_contact" 
            WHERE "idCampaign" = $1 
            AND "emailContact" = $2`, [this.idCampaign, this.email]);
            // Si aucun résultat est trouve on on ajoute le contact dans la table campaign_has_contact puis on incremente le nombre de contact pour mettre à jour le nombre de contact de la campagne
            if (requestExist.rowCount == 0) {
                const requestInsert = `INSERT INTO "campaign_has_contact" 
                ("idCampaign", "emailContact", "idList", "nameFile", "sent", "unsubscribed", "openEmail") 
                VALUES ($1, $2, $3, $4, $5, $6, $7);`;
                const valuesInsert = [this.idCampaign, this.email, lastIdList, "no list", false, false, 0];
                await client.query(requestInsert, valuesInsert)
                newContact++
            }
        }
        // Ajout ce contact seulement si il n'existe pas dans la table campagne
        const requestContactExist = await client.query('SELECT * FROM "contact" WHERE "email" = $1', [this.email]);
        if (requestContactExist.rowCount == 0) {
            const requestInsert = `INSERT INTO "contact" 
            ("civility", "lastname", "firstname", "business", "email", "unsubscribedDate", "createdDate", "contactToken") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
            const valuesInsert = [
                this.civility, 
                this.lastname, 
                this.firstname, 
                this.business, 
                this.email, 
                null, 
                new Date(), 
                (`${process.env.START_KEY_TOKEN}${crypto.randomBytes(64).toString('hex')}${process.env.END_KEY_TOKEN}`)];
            await client.query(requestInsert, valuesInsert);
        }
        // Requete pour récupérer le nombre de contact de la campagne
        const requestNbrContact = await client.query('SELECT * FROM "campaign" WHERE "id" = $1', [this.idCampaign]);
        const newNbrContact = requestNbrContact.rows[0].nbrContact + newContact

        // Update du nombre de contact de la campagne à l'import de chaque liste de contact
        const updateNbrContact = `UPDATE "campaign" SET "nbrContact" = $1 WHERE "id" = $2;`;
        const valuesUdpate = [newNbrContact, this.idCampaign];
        await client.query(updateNbrContact, valuesUdpate)
    }
}

export default Contact;