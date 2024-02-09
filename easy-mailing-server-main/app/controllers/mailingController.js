import Mailing from '../models/Mailing.js';

const mailingController = {
    addMailing: async function(req, res) {
        try {
            new Mailing(req.body.link, req.body.text, req.body.idCampaign)
            .addMailing()

            res.json('ok');
        } catch (error) {
            console.error(error)
            res.status(500).json('pas ok')
        }
    }
}
export default mailingController;