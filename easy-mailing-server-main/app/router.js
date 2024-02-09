import express from 'express';
import globalController from './controllers/globalController.js';
import campaignController from './controllers/campaignController.js';
import userController from './controllers/userController.js';
import contactController from './controllers/contactController.js';
import mailingController from './controllers/mailingController.js';
import authToken from './middleware/auth.js';
import statisticController from './controllers/statisticController.js';
import cron from 'node-cron';

const router = express.Router();

// doc api
router.get('/api/doc', globalController.documentation);
router.get('/api/doc/style.css', globalController.documentationStyle);
router.get('/api/doc/script.js', globalController.documentationScript);


router.get('/api/listCampaign', authToken, campaignController.listCampaign);
router.get('/api/contactList/:id', authToken, contactController.contactList);
router.get('/api/contactListUnsuscribed/:id', authToken, contactController.contactListUnsuscribed);
router.get('/api/listUser', authToken, userController.listUser);
router.get('/api/campaignDetail/:id', authToken, campaignController.campaignDetail);
router.get('/api/statistic/:id', authToken, statisticController.statistic);
router.get('/api/:idCampaign/:nameList/invalidContact', authToken, contactController.invalidContact);
router.get('/api/unsubscribed/:token', contactController.unsubscribedContact);
router.get('/api/subscribed/:token', contactController.subscribedContact);
router.get('/api/tracker/:contactToken/:campaignToken/cid:pixel', statisticController.tracker);

router.post('/api/validateCampaign', authToken, campaignController.validateCampaign);
router.post('/api/addMailing', authToken, mailingController.addMailing);
router.post('/api/login', userController.login);
router.post('/api/createContactList', authToken, contactController.createContactList);
router.post('/api/addContact', authToken, contactController.addContact);
router.post('/api/createCampaign', authToken, campaignController.createCampaign);
router.post('/api/testSendCampaign', authToken, campaignController.testSendCampaign);

router.delete('/api/deleteContactList/:idCampaign/:idList/:nameList',  contactController.deleteContactList);

cron.schedule('31 * * * *', () => {
    campaignController.sendCampaign();
})
export default router;



