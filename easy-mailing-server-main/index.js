import express from 'express';
import * as dotenv from 'dotenv'; 
import router from './app/router.js';
import { rateLimit } from 'express-rate-limit'
import cors from 'cors';

dotenv.config(); 

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  message: 'too many requests from this IP, please try again after 1 minute',
})

const app = express();
const port = process.env.PORT || 3000;
const url_server = process.env.URL_SERVER || 'localhost';

app.use(cors({origin: '*'}));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(limiter)
app.use(router);
app.listen(port, () => { console.log(`Start server ${url_server}:${port}`) });