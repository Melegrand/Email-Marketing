import client from '../database.js';
import validator from 'validator';
import * as dotenv from 'dotenv';
dotenv.config(); 

class Mailing {
    #link;
    #text;
    #idCampaign;

    constructor(link, text, idCampaign) {
        this.link = link;
        this.text = text;
        this.idCampaign = idCampaign;
    }

    set link(link) {
        if (link !== null && link !== '' && !validator.isURL(link)) {
            throw new Error('erreur link')
        } else {
            this.#link = link;
        }
    }

    set text(text) {
        if (validator.isEmpty(text) || !typeof(text) === 'string' || !validator.isLength(text, { min: 1, max: 2500 })) {
            throw new Error('erreur text')
        } else {
            this.#text = text;
        }
    }
    set idCampaign(idCampaign) {
        this.#idCampaign = idCampaign;     
    }

    get link() {
        return this.#link
    }
    get text() {
        return this.#text
    }

    get idCampaign() {
        return this.#idCampaign
    }

    async addMailing() {
        const requestUpdate = await client.query(`UPDATE "campaign" 
        SET "textCampaign" = $1,
        "linkCampaign" = $2, 
        "mailing" = $3 
        WHERE "id" = $4`, [this.text, this.link, true, this.idCampaign]);
    }
}

export default Mailing;