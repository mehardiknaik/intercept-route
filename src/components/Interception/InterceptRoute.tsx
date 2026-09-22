import { ComponentType, ReactNode } from 'react';
import { Route as RouterRoute, RouteProps } from 'react-router';

export type InterceptRouteProps = RouteProps & {
  /** Mark this route as renderable inside the modal overlay when intercepted. */
  intercept?: boolean;
  /** Component used to wrap the intercepted element (defaults to the one passed to InterceptRoutes). */
  interceptWrapper?: ComponentType<{ children: ReactNode }>;
};

/**
 * Same identity as react-router's `Route` (required so `<Routes>` recognizes it),
 * just typed to accept `intercept` / `interceptWrapper` for use with `InterceptRoutes`.
 */
export const Route = RouterRoute as unknown as ComponentType<InterceptRouteProps>;
