import { lazy } from 'react';
import Navbar from './components/Navbar';
import { InterceptRoutes, Route } from './components/Interception';
import withPageContext from './hoc/withPageContext';
import { Model } from './components/Model';

const HomePage = lazy(() => import('./pages/HomePage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const AboutPage = lazy(() => import('./pages/AboutPage/index'));
const WatchPage = lazy(() => import('./pages/WatchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage'));
const MoviePageWithHOC = withPageContext(MoviePage);
// const HomePageWithHOC = withPageContext(HomePage);

/**
 * Route Interception Pattern with Context
 *
 * The InterceptionProvider manages sessionState (backgroundLocation) in React memory.
 * This state automatically clears on page refresh (no browser history pollution).
 *
 * Routes marked `intercept` are rendered normally when navigated to directly, and
 * inside `defaultWrapper` (or their own `interceptWrapper`) as a modal overlay when
 * navigated to via useNavigateInterception/LinkInterception with intercept enabled.
 */
const AppRoutes = () => {
  return (
    <InterceptRoutes defaultWrapper={Model}>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route intercept path="/movie/:id" element={<MoviePageWithHOC />} />
        <Route intercept path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </InterceptRoutes>
  );
};

export default AppRoutes;
