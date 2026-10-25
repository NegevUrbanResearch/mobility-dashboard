import React, { useState, useEffect, useRef } from 'react';

interface Page {
  title: string;
  path: string;
}

const pages: Page[] = [
  { title: 'Dataset Details', path: 'pages/dataset-details.html' },
  { title: 'Origin Statistics', path: 'pages/origin_statistics.html' },
  { title: 'Temporal Visualization', path: 'pages/temporal_visualization.html' },
  { title: 'Distance Visualization', path: 'pages/merged_distance_viz.html' },
  { title: 'Catchment Areas', path: 'pages/catchment_dash.html' },
  { title: 'Route Intensity', path: 'pages/route_intensity_interactive.html' },
  { title: 'Mode Histograms', path: 'pages/mode_share_visualization.html' },
  { title: 'Origin Index', path: 'pages/origin-index.html' },
  { title: 'Trip Animation', path: 'pages/trip_animation_time_dark_nolabels.html' }
];

const PageNavigator: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const progressIntervalRef = useRef<number | null>(null);
  const hideLoaderTimeoutRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getPagePath = (path: string): string => {
    return `${process.env.PUBLIC_URL}/${path}`;
  };

  useEffect(() => {
    goToPage(0);
  }, []);

  useEffect(() => {
    if (!currentUrl) {
      return;
    }

    const nextIndex = (currentPage + 1) % pages.length;
    const nextPath = getPagePath(pages[nextIndex].path);
    const preloadFrame = document.createElement('iframe');
    preloadFrame.style.display = 'none';
    preloadFrame.src = nextPath;
    document.body.appendChild(preloadFrame);

    return () => {
      if (document.body.contains(preloadFrame)) {
        document.body.removeChild(preloadFrame);
      }
    };
  }, [currentPage, currentUrl, pages.length]);

  const clearProgressInterval = (): void => {
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const clearHideLoaderTimeout = (): void => {
    if (hideLoaderTimeoutRef.current !== null) {
      window.clearTimeout(hideLoaderTimeoutRef.current);
      hideLoaderTimeoutRef.current = null;
    }
  };

  const startLoading = (): void => {
    clearProgressInterval();
    clearHideLoaderTimeout();
    setIsLoading(true);
    setLoadingProgress(0);

    progressIntervalRef.current = window.setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          return 90;
        }
        return Math.min(prev + Math.random() * 12, 90);
      });
    }, 180);
  };

  const goToPage = (index: number): void => {
    startLoading();
    setCurrentPage(index);
    setCurrentUrl(getPagePath(pages[index].path));
  };

  const selectPage = (index: number): void => {
    setMenuOpen(false);
    if (index !== currentPage) {
      goToPage(index);
    }
  };

  const goToPreviousPage = (): void => {
    setMenuOpen(false);
    goToPage((currentPage - 1 + pages.length) % pages.length);
  };

  const goToNextPage = (): void => {
    setMenuOpen(false);
    goToPage((currentPage + 1) % pages.length);
  };

  const handleIframeLoaded = (): void => {
    clearProgressInterval();
    setLoadingProgress(100);
    clearHideLoaderTimeout();
    hideLoaderTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
    }, 220);
  };

  useEffect(() => {
    return () => {
      clearProgressInterval();
      clearHideLoaderTimeout();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent): void => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="dashboard-shell">
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner-container">
            <div className="loading-spinner-bg"></div>
            <div className="loading-spinner"></div>
          </div>
          
          <div className="loading-text">
            Loading
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
          </div>
          
          <div className="loading-progress-container">
            <div className="loading-progress-bg">
              <div 
                className="loading-progress-fill" 
                style={{ width: `${Math.round(loadingProgress)}%` }}
              />
            </div>
            <div className="loading-progress-text">
              {Math.round(loadingProgress)}%
            </div>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <div className="dashboard-logo-wrap">
          <img
            className="dashboard-logo"
            src={`${process.env.PUBLIC_URL}/images/nur-logo-white.png`}
            alt="Negev Urban Research logo"
          />
        </div>
        <div className="view-switcher" ref={menuRef}>
          <div className="view-switcher-bar">
          <button
            type="button"
            className="view-step"
            onClick={goToPreviousPage}
            aria-label="Previous view"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M10 4 6 8l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Prev
          </button>
          <button
            type="button"
            className={`view-switcher-trigger ${menuOpen ? 'is-open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            aria-controls="view-switcher-menu"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span className="view-switcher-kicker">Views</span>
            <span className="view-switcher-current">{pages[currentPage].title}</span>
            <svg
              className="view-switcher-chevron"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M4 6.5 8 10.5 12 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="view-step"
            onClick={goToNextPage}
            aria-label="Next view"
          >
            Next
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M6 4l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          </div>
          {menuOpen && (
            <div
              id="view-switcher-menu"
              className="view-switcher-menu"
              role="listbox"
              aria-label="Dashboard views"
            >
              <p className="view-switcher-heading">Choose a view</p>
              {pages.map((page, index) => (
                <button
                  key={page.path}
                  type="button"
                  role="option"
                  aria-selected={index === currentPage}
                  className={`view-switcher-option ${index === currentPage ? 'is-active' : ''}`}
                  onClick={() => selectPage(index)}
                >
                  <span className="view-switcher-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="view-switcher-name">{page.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="dashboard-header-spacer" aria-hidden="true"></div>
      </header>

      <main className="dashboard-content">
        <iframe
          id="content-frame"
          src={currentUrl}
          title={pages[currentPage].title}
          className="dashboard-frame"
          onLoad={handleIframeLoaded}
        />
      </main>
    </div>
  );
};

export default PageNavigator;