import client from '../database.js';
import * as dotenv from 'dotenv';

dotenv.config(); 
const statisticController = {

    statistic: async function(req, res) {
        try {
            // Je récupère l'id de campagne
            const id = req.params.id;
            // Je vais chercher dans la table de liaison le nombre de contact de la campagne
            const totalContact = await client.query(`SELECT * FROM "campaign_has_contact" WHERE "idCampaign" = $1`, [req.params.id]);
            // Je vais chercher le nom de la campagne
            const currentCampaign = await client.query(`SELECT "nameCampaign" FROM "campaign" WHERE "id" = $1`, [req.params.id]);
            // Variable du nombre de contacts ddésinscris qui va s'incrémenter par ma boucle
            let unsubscribedContact = 0;

            // Je boucle sur la réponse du nombre de contacts pour récupérer le nombre de contacts désinscris dedans.
            for(let i=0; i< totalContact.rows.length; i++){ 
                totalContact.rows[i].unsubscribed && unsubscribedContact ++;
            }
            // Requete pour comptabilisé les ouvertures de l'email
            const openingCount = await client.query(`SELECT * FROM "campaign_has_contact" WHERE "idCampaign" = $1 AND "openEmail" > 0`, [id]);
            // Je renvoie le nombre de contacts total, le nombre de contacts désinscris et le nom de la campagne
            res.json({totalContact : totalContact.rowCount, unsubscribedContact:unsubscribedContact, currentCampaign: currentCampaign.rows[0].nameCampaign, nbrOpening: parseInt(openingCount.rowCount)});
        } catch (error) {
            res.json(false)
        }
    },
    tracker: async (req, res) => {
        console.log(req.params);
        try {
            // Récupérez les informations sur l'ouverture de l'email depuis la requête.
            const { contactToken, campaignToken } = req.params;
            // requete pour récuperer le nombre d'ouverture de l'email actuel
            const requestJoin = await client.query(`SELECT * FROM "campaign_has_contact" 
            FULL JOIN "contact" ON "campaign_has_contact"."emailContact" = "contact"."email" 
            FULL JOIN "campaign" ON "campaign_has_contact"."idCampaign" = "campaign"."id" 
            WHERE "contact"."contactToken" = $1 AND "campaign"."campaignToken" = $2;`, 
            [`${process.env.START_KEY_TOKEN}${contactToken}${process.env.END_KEY_TOKEN}`, 
            `${process.env.START_KEY_TOKEN}${campaignToken}${process.env.END_KEY_TOKEN}`]);
            if (requestJoin.rowCount > 0) {
                console.log(requestJoin.rows[0]);
                // Incremente le nombre d'ouverture de l'email
                const nbr = requestJoin.rows[0].openEmail + 1;
                console.log(nbr);
                //update du nombre d'ouverture de l'email
                const updateOpenEmail = `UPDATE "campaign_has_contact" SET "openEmail" = $1 WHERE "emailContact" = $2 AND "idCampaign" = $3;`;
                const valuesUpdateOpenEmail = [nbr, requestJoin.rows[0].emailContact, requestJoin.rows[0].idCampaign];
                await client.query(updateOpenEmail, valuesUpdateOpenEmail);
            }
            res.json(true)
        } catch (error) {
            console.log(error);
            res.json(false)
        }
    }
};
export default statisticController;