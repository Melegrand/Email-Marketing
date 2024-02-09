import './index.scss';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <Link to='/plan' aria-current={location === '/plan' ? 'page' :  null} className={"navigation__container__list__element__link"}>Plan du site</Link>
    </footer>
  )
}
export default Footer;