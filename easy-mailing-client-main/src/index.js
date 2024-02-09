import { createRoot } from 'react-dom/client';
import App from './components/App';
import './style.scss';
import * as dotenv from 'dotenv';
dotenv.config();

const rootDOMElement = document.getElementById('app');
const root = createRoot(rootDOMElement);
root.render(<App />);