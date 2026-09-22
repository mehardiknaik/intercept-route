import {
  Children,
  ComponentType,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  Fragment
} from 'react';
import { matchPath, Route, Routes, useLocation } from 'react-router';
import { InterceptionProvider, useInterceptionContext } from './InterceptionContext';

interface InterceptRouteEntry {
  path: string;
  route: ReactElement;
}

/**
 * Walks the declared route tree and flattens every route marked `intercept`
 * into a standalone route (path + element) whose element is wrapped by its
 * `interceptWrapper` (or the default).
 */
const collectInterceptRoutes = (
  children: ReactNode,
  defaultWrapper: ComponentType<{ children: ReactNode }>
): InterceptRouteEntry[] => {
  const routes: InterceptRouteEntry[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Fragment) {
      routes.push(
        ...collectInterceptRoutes((child.props as { children: ReactNode }).children, defaultWrapper)
      );
      return;
    }

    const {
      intercept,
      interceptWrapper,
      path,
      element,
      children: nested
    } = child.props as {
      intercept?: boolean;
      interceptWrapper?: ComponentType<{ children: ReactNode }>;
      path?: string;
      element?: ReactNode;
      children?: ReactNode;
    };

    if (intercept && path && element) {
      const Wrapper = interceptWrapper ?? defaultWrapper;
      routes.push({
        path,
        route: <Route key={path} path={path} element={<Wrapper>{element}</Wrapper>} />
      });
    }

    if (nested) {
      routes.push(...collectInterceptRoutes(nested, defaultWrapper));
    }
  });

  return routes;
};

interface InterceptRoutesProps {
  children: ReactNode;
  /** Wrapper used for intercepted routes that don't specify their own `interceptWrapper`. */
  defaultWrapper: ComponentType<{ children: ReactNode }>;
}

const InterceptRoutesInner = ({ children, defaultWrapper }: InterceptRoutesProps) => {
  const location = useLocation();
  const {
    backgroundLocation: bgloc,
    isIntercepting,
    setIsIntercepting,
    setBackgroundLocation
  } = useInterceptionContext();

  const interceptEntries = useMemo(
    () => collectInterceptRoutes(children, defaultWrapper),
    [children, defaultWrapper]
  );

  // Only treat the current URL as a modal if it actually matches an `intercept` route,
  // otherwise a navigation to an unrelated page (e.g. /about) would keep rendering the
  // stale background location instead of the page that was navigated to.
  const matchesInterceptRoute = interceptEntries.some((entry) =>
    matchPath(entry.path, location.pathname)
  );
  const isModalView = Boolean(
    isIntercepting && bgloc && bgloc.pathname !== location.pathname && matchesInterceptRoute
  );
  const backgroundLocation = isModalView ? bgloc : null;

  useEffect(() => {
    if (isIntercepting && bgloc && bgloc.pathname !== location.pathname && !matchesInterceptRoute) {
      setIsIntercepting(false);
      setBackgroundLocation(null);
    }
  }, [
    isIntercepting,
    bgloc,
    location,
    matchesInterceptRoute,
    setIsIntercepting,
    setBackgroundLocation
  ]);

  return (
    <>
      <Routes location={backgroundLocation ?? location}>{children}</Routes>
      {isModalView && <Routes>{interceptEntries.map((entry) => entry.route)}</Routes>}
    </>
  );
};

/**
 * Drop-in replacement for `<Routes>` that also understands `intercept` / `interceptWrapper`
 * props on `<Route>` (from ./InterceptRoute), rendering a modal overlay automatically
 * instead of requiring a hand-written second `<Routes>` tree. Owns the InterceptionProvider,
 * so callers don't need to wrap the app with it separately.
 *
 * @example
 * <InterceptRoutes defaultWrapper={Model}>
 *   <Route path="/" element={<Navbar />}>
 *     <Route intercept path="/movie/:id" element={<MoviePage />} />
 *     <Route path="/" element={<HomePage />} />
 *   </Route>
 * </InterceptRoutes>
 */
export const InterceptRoutes = (props: InterceptRoutesProps) => (
  <InterceptionProvider>
    <InterceptRoutesInner {...props} />
  </InterceptionProvider>
);
