import {
  useNavigate as useReactRouterNavigate,
  useLocation,
  NavigateOptions,
  To
} from 'react-router';
import { useInterceptionContext } from './InterceptionContext';

interface UseNavigateInterceptionOptions extends NavigateOptions {
  intercept?: boolean; // true to set backgroundLocation for modal, false to clear it
}

/**
 * Custom hook that wraps react-router's useNavigate and manages modal interception state.
 * The sessionState (backgroundLocation) is stored in React memory and clears on page refresh.
 *
 * @returns navigate function with interception support
 * @example
 * const navigate = useNavigateInterception();
 * // Navigate with modal overlay:
 * navigate('/movie/123', { intercept: true });
 * // Navigate without modal (full page):
 * navigate('/movie/123', { intercept: false });
 * // Go back and close modal:
 * navigate(-1);
 */
export const useNavigateInterception = () => {
  const navigate = useReactRouterNavigate();
  const location = useLocation();
  const context = useInterceptionContext();

  const { setIsIntercepting, setBackgroundLocation, backgroundLocation } = context;

  return (to: To | number, options?: UseNavigateInterceptionOptions) => {
    const { intercept = false, ...navOptions } = options || {};

    if (typeof to === 'number') {
      // Delta navigation (go back/forward)
      navigate(to);
    } else {
      if (intercept) {
        if (!backgroundLocation) setBackgroundLocation(location);

        setIsIntercepting(true);
      } else {
        // Clear interception state for full-page navigation
        setIsIntercepting(false);
        setBackgroundLocation(null);
      }

      navigate(to, navOptions);
    }
  };
};
