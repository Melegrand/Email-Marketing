import client from '../database.js';
import { engine } from 'express-handlebars';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const globalController = {
    documentation: function(_, res) {
        const filePath = path.join(__dirname, '../../public/documentation/doc.html');
        res.status(200).sendFile(filePath);
    },
    documentationStyle: function(_, res) {
        const filePath = path.join(__dirname, '../../public/documentation/style.css');
        res.status(200).sendFile(filePath);
    },
    documentationScript: function(_, res) {
        const filePath = path.join(__dirname, '../../public/documentation/script.js');
        res.status(200).sendFile(filePath);
    }
};

export default globalController;