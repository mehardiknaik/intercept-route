import { MouseEvent } from 'react';
import { Link, LinkProps, useLocation } from 'react-router';
import { useInterceptionContext } from './InterceptionContext';

interface LinkInterceptionProps extends LinkProps {
  intercept?: boolean;
}

const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>, target?: string) => {
  return (
    event.button === 0 &&
    (!target || target === '_self') &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
};

/**
 * Link wrapper that manages modal interception state before routing.
 *
 * @example
 * <LinkInterception to="/movie/123" intercept>
 *   Open in modal
 * </LinkInterception>
 */
export const LinkInterception = ({
  intercept = false,
  onClick,
  target,
  ...props
}: LinkInterceptionProps) => {
  const location = useLocation();
  const context = useInterceptionContext();

  if (!context) {
    throw new Error('LinkInterception must be used within InterceptionProvider');
  }

  const { backgroundLocation, setBackgroundLocation, setIsIntercepting } = context;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !isPlainLeftClick(event, target)) {
      return;
    }

    if (intercept) {
      if (!backgroundLocation) {
        setBackgroundLocation(location);
      }
      setIsIntercepting(true);
    } else {
      setIsIntercepting(false);
      setBackgroundLocation(null);
    }
  };

  return <Link {...props} target={target} onClick={handleClick} />;
};
