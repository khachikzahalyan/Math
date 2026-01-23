import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - handles scroll restoration on route changes
 * 
 * Behavior:
 * - PUSH/REPLACE navigation: scrolls to top (or hash element if present)
 * - POP navigation (back/forward): scrolls to top by default
 *   (set RESTORE_SCROLL_ON_POP = true to let browser restore previous position)
 * - Hash links: scrolls to the element with matching id
 */

// Set to true if you want back/forward to restore previous scroll position
const RESTORE_SCROLL_ON_POP = false;

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const lastKeyRef = useRef(key);

  useEffect(() => {
    // Detect navigation type: POP (back/forward) vs PUSH/REPLACE
    // React Router generates a new key for PUSH/REPLACE, but reuses keys on POP
    const isPop = key === lastKeyRef.current || key === 'default';
    lastKeyRef.current = key;

    // Option: restore scroll on back/forward navigation
    if (RESTORE_SCROLL_ON_POP && isPop) {
      return; // Let browser handle scroll restoration
    }

    // Handle hash links (e.g., /docs#section)
    if (hash) {
      // Small delay to ensure the DOM has rendered
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
      return;
    }

    // Default: scroll to top
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  return null;
}

export default ScrollToTop;
