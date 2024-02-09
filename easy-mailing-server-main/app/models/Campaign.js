import client from '../database.js';
import validator from 'validator';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config(); 

const now = new Date();

class Campaign {
    #nameCampaign;
    #emailCreator;
    #subject;
    #dateStart;
    #dateEnd;

    constructor(nameCampaign, emailCreator, subject, dateStart, dateEnd) {
        this.nameCampaign = nameCampaign;
        this.emailCreator = emailCreator;
        this.subject = subject;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }

    get nameCampaign() {
        return this.#nameCampaign
    }
    get subject() {
        return this.#subject
    }

    get emailCreator() {
        return this.#emailCreator
    }

    get nameCampaign() {
        return this.#nameCampaign
    }
    get dateStart() {
        return this.#dateStart
    }
    get dateEnd() {
        return this.#dateEnd
    }

    set nameCampaign(nameCampaign) {
        if (!typeof(nameCampaign) === 'string' || !validator.isLength(nameCampaign, { min: 1, max: 80 })) {
            throw new Error('erreur nameCampaign')
        } else {
            this.#nameCampaign = nameCampaign;
        }
    }

    set emailCreator(emailCreator) {
        if (!validator.isEmail(emailCreator) || validator.isEmpty(emailCreator)) {
            throw new Error('erreur email')
        } else {
            this.#emailCreator = emailCreator;
        }
    }
    set subject(subject) {
        if (!typeof(subject) === 'string'  || !validator.isLength(subject, { min: 0, max: 80 })) {
            throw new Error('erreur subject')
        } else {
            this.#subject = subject;
        }
    }

    set dateStart(dateStart) {
        if (!validator.isDate(dateStart) || dateStart < now || dateStart > this.dateEnd) {
            throw new Error('erreur dateStart')
        } else {
            const date = new Date(dateStart)
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(1)
            this.#dateStart = date
        }
    }

    set dateEnd(dateEnd) {
        if (!validator.isDate(dateEnd) || dateEnd < now || dateEnd < this.dateStart) {
            throw new Error('erreur dateEnd')
        } else {
            const date = new Date(dateEnd)
            date.setHours(23)
            date.setMinutes(59)
            date.setSeconds(59)
            this.#dateEnd = date
        }
    }

    async addCampaign() {
        const insertInCampaign = `INSERT INTO "campaign" 
        ("nameCampaign", 
        "subjectCampaign", 
        "startCampaign", 
        "endCampaign", 
        "creatorEmail",
        "nbrContact", 
        "mailing", 
        "full", 
        "sent", 
        "createdDate", 
        "campaignToken") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
        const valuesInCampaign = [
            this.nameCampaign, 
            this.subject, 
            this.dateStart, 
            this.dateEnd, 
            this.emailCreator, 
            0, 
            false, 
            false, 
            false, 
            new Date(), 
            (`${process.env.START_KEY_TOKEN}${crypto.randomBytes(64).toString('hex')}${process.env.END_KEY_TOKEN}`)];
        await client.query(insertInCampaign, valuesInCampaign)
    }
}

export default Campaign;