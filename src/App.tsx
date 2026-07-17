import { lazy, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Navbar from './components/Navbar';
import { InterceptionContext } from './context/intercaption/InterceptionContext';
import withPageContext from './hoc/withPageContext';

const Model = lazy(() => import('./components/Model'));
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const AboutPage = lazy(() => import('./pages/AboutPage/index'));
const WatchPage = lazy(() => import('./pages/WatchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MoviePageWithHOC = withPageContext(MoviePage);
// const HomePageWithHOC = withPageContext(HomePage);

/**
 * Route Interception Pattern with Context
 *
 * The InterceptionProvider manages sessionState (backgroundLocation) in React memory.
 * This state automatically clears on page refresh (no browser history pollution).
 *
 * When a user clicks a movie card:
 *   - useNavigateInterception sets backgroundLocation in context
 *   - Main Routes renders HomePage (using backgroundLocation)
 *   - Modal Routes renders the modal overlay on top
 *
 * When direct navigation to /movie/:id:
 *   - backgroundLocation is null in context
 *   - Main Routes renders MoviePage normally (no modal)
 */
const AppRoutes = () => {
  const location = useLocation();
  const context = useContext(InterceptionContext);
  const bgloc = context?.backgroundLocation;
  const isIntercepting = context?.isIntercepting;
  const isModalView = isIntercepting && bgloc && bgloc.pathname !== location.pathname;
  const backgroundLocation = isModalView ? bgloc : null;
  return (
    <>
      {/* <Navbar /> */}

      {/* Primary routes — use backgroundLocation when intercepting */}
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Navbar />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/movie/:id" element={<MoviePageWithHOC />} />
        </Route>
      </Routes>

      {/* Modal overlay — only render when backgroundLocation is set */}
      {isModalView && (
        <Routes>
          <Route
            path="/movie/:id"
            element={
              <Model>
                <MoviePageWithHOC />
              </Model>
            }
          />
          <Route
            path="/login"
            element={
              <Model>
                <LoginPage />
              </Model>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default AppRoutes;
