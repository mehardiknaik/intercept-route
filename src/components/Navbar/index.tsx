import { Outlet, useLocation } from 'react-router';
import style from './Navbar.module.css';
import { LinkInterception as Link } from '../../context/intercaption/LinkInterception';
import useIsMobile from '../../hooks/useIsMobile';

const Navbar = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  return (
    <>
      <nav className={style.nav}>
        <Link to="/" className={style.logo}>
          🎬 Intercept Route
        </Link>

        <div className={style.links}>
          <Link
            to="/about"
            className={`${style.link} ${pathname === '/about' ? style.active : ''}`}>
            About
          </Link>
          <Link
            intercept={!isMobile}
            to="/login"
            className={`${style.link} ${pathname === '/login' ? style.active : ''}`}>
            Login
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
