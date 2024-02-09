import client from '../database.js';
import dateFormat from 'dateformat';
import sendEmail from "../functions/sendMail.js";
import testSendEmail from '../functions/testSendMail.js';
import validator from 'validator';
import * as dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
dotenv.config(); 

const campaignController = {
    listCampaign: async function(_, res) {
        try {
            const campaignRequest = await client.query('SELECT * FROM "campaign" ORDER BY "id" ASC');
            const list = campaignRequest.rows;
            res.send(list);
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },
    campaignDetail: async function(req, res) {
        try {
            const campaignRequest = await client.query('SELECT * FROM "campaign" WHERE id = $1', [req.params.id]);
            const list = campaignRequest.rows[0];
            res.send(list);
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },
    createCampaign: async function(req, res) {
        try {
            new Campaign (req.body.nameCampaign, req.body.emailCreator, req.body.subject, req.body.startDate, req.body.endDate)
            .addCampaign()
            res.send('ok');
        } catch (error) {
            console.error(error)
            res.status(500).send('pas ok')
        }
    },
    validateCampaign: async function(req, res) {
        console.log(req.body)
        try {
            // Update de l'etat de la campagne
            // On update aussi la date de début au cas ou l'utilisateur n'a pas validé la campagne avant la date de début. Si le cas se pose, on met a jour celle-ci avec la date du jour
            const updateStatusCampaign = await client.query('UPDATE "campaign" SET "full" = $1, "sent" = $2, "startCampaign" = $3 WHERE "id" = $4', [true, false, req.body.startDate, req.body.id]);
            res.json(true);
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },
    sendCampaign: async function(req, res) {
        try {
            const dateToday = dateFormat(new Date(), 'yyyy-mm-dd');
            // Recherche de toutes les campagnes pour envoi programmé
            const listCampaign = await client.query('SELECT * FROM "campaign"');
            
            // Cette fonction s'occupe de l'envoi des campagnes avec un delai
            async function sendCampaignWithDelay(i) {
                
                // Si le paramètre i est inferieur au nombre d'enregistrement de la liste de tous les contacts de la campagne
                if (i < listCampaign.rows.length) {
                    
                    // On place dans une variable chaque campagne avec le parametre comme index pour conserver la campagne courante
                    const campaign = listCampaign.rows[i];

                    // Si la campagne est complete, pas encore envoyée et que la date est egale ou superieur à aujourd'hui
                    if (campaign.full && !campaign.sent && dateFormat(campaign.startCampaign, 'yyyy-mm-dd') >= dateToday) {

                        // Requête pour récupérer la liste de tous les contacts de la campagne
                        const dataCampaign = await client.query('SELECT * FROM "campaign" WHERE "id" = $1', [campaign.id]);

                        // On recupere les informations de la campagne courante dans les tables "campaign_has_contact" et "contact" pour bouclé sur ce résultat
                        const requestJoin = await client.query('SELECT * FROM "campaign_has_contact" FULL JOIN "contact" ON "campaign_has_contact"."emailContact" = "contact"."email" WHERE "idCampaign" = $1', [campaign.id]);

                        // fonction qui permet de bouclé sur le nombre de contact lié à la campagne courante
                        async function sendEmailWithDelay(j) {

                            // Si le parametre "j" est inferieur au nombre de campagnes de la liste, on boucle sur les campagnes
                            if (j < requestJoin.rows.length) {

                                // On met à jour le statut de chaque contact comme "envoyé"
                                const reqUpdateSubscribe = `UPDATE "campaign_has_contact" SET "sent" = $1 WHERE "emailContact" = $2 AND "idCampaign" = $3;`;
                                const valuesUpdateSubscribe = [true, requestJoin.rows[j].email, campaign.id];
                                await client.query(reqUpdateSubscribe, valuesUpdateSubscribe);

                                // On envoie le mail à chaque contact
                                // Je renvoie le token comme paramètre sans les clefs
                                let link = dataCampaign.rows[0].linkCampaign !== null ? dataCampaign.rows[0].linkCampaign : ''
                                sendEmail(requestJoin.rows[j].email, dataCampaign.rows[0].subjectCampaign, requestJoin.rows[j].civility, requestJoin.rows[j].lastname, dataCampaign.rows[0].textCampaign, link, requestJoin.rows[j].contactToken.slice(3, -3), dataCampaign.rows[0].campaignToken.slice(3, -3));

                                // On incrémente le parametre "j" afin de continuer la boucle
                                j++;

                                //On déclenche l'envoi des emails pour cette campagne avec un delais pour que le serveur d'envoi ne soit pas bloqué
                                setTimeout(() => {
                                    sendEmailWithDelay(j);
                                }, 500);
                            } else {
                                // Si le nombre de contacts liés à cette campagne est finit, on passe à la campagne suivante
                                await client.query('UPDATE "campaign" SET "full" = $1, "sent" = $2 WHERE "id" = $3', [false, true, campaign.id]);

                                // On incrémente le parametre "i" afin de continuer la boucle sur les campagnes
                                i++;
                                setTimeout(() => {
                                    sendCampaignWithDelay(i);
                                }, 2000);
                            }
                        }
                        // Commencer l'envoi des emails pour cette campagne
                        sendEmailWithDelay(0);
                    } else {
                        i++;
                        setTimeout(() => {
                            sendCampaignWithDelay(i);
                        }, 2000);
                    }
                }
            }
            sendCampaignWithDelay(0);

        } catch (error) {
            console.error(error)
            res.status(500)
        }
    },
    testSendCampaign: async function(req, res) {
        try {
            // Recherche de toutes les campagnes pour envoi programmé
            const listCampaign = await client.query('SELECT * FROM "campaign" WHERE "id" = $1', [req.body.id]);

            const link = listCampaign.rows[0].linkCampaign;
            link != null ? listCampaign.rows[0].linkCampaign : listCampaign.rows[0].linkCampaign = '';

            if (listCampaign.rows[0].full === false && listCampaign.rows[0].sent === false && validator.isEmail(req.body.emailTest)) {
                testSendEmail(req.body.emailTest, listCampaign.rows[0].subjectCampaign, listCampaign.rows[0].textCampaign, listCampaign.rows[0].linkCampaign);
            }
            res.send('ok');
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    }
}
export default campaignController;