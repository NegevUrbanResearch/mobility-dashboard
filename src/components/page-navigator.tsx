import React, { useState, useEffect } from 'react';

interface Page {
  title: string;
  path: string;
}

const PageNavigator: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [nextPageUrl, setNextPageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);

  const pages: Page[] = [
    { title: 'Distance Visualization', path: 'pages/merged_distance_viz.html' },
    { title: 'Walking Arc', path: 'pages/walking_arc_visualization_glow.html' },
    { title: 'Temporal Visualization', path: 'pages/temporal_visualization.html' },
    { title: 'Origin Statistics', path: 'pages/origin_statistics.html' },
    { title: 'Origin Index', path: 'pages/origin-index.html' },
    { title: 'Catchment Area', path: 'pages/catchment_dash.html' },
    { title: 'Route Intensity', path: 'pages/route_intensity_interactive.html' },
    { title: 'Trip Animation', path: 'pages/trip_animation_time_dark_nolabels.html' },
    { title: 'Walking Trip Animation', path: 'pages/walking_trip_animation.html' }
  ];

  const getPagePath = (path: string): string => {
    return `${process.env.PUBLIC_URL}/${path}`;
  };

  useEffect(() => {
    goToPage(0);
  }, []);

  // Preload next page
  useEffect(() => {
    const nextIndex = (currentPage + 1) % pages.length;
    const nextPath = getPagePath(pages[nextIndex].path);
    setNextPageUrl(nextPath);
    
    // Create hidden iframe for preloading
    const preloadFrame = document.createElement('iframe');
    preloadFrame.style.display = 'none';
    preloadFrame.src = nextPath;
    document.body.appendChild(preloadFrame);

    return () => {
      document.body.removeChild(preloadFrame);
    };
  }, [currentPage]);

  const goToPage = (index: number): void => {
    setIsLoading(true);
    setLoadingProgress(0);
    setCurrentPage(index);
    const fullPath = getPagePath(pages[index].path);
    setCurrentUrl(fullPath);
    
    // Simulate progress while loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
    
    // Show loading state in current iframe
    const iframe = document.getElementById('content-frame') as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = () => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          iframe.style.opacity = '1';
        }, 500); // Short delay to show 100%
      };
      iframe.style.opacity = '0';
    }
  };

  // Button styles
  const buttonStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    marginRight: '16px',
    fontSize: '16px',
    fontWeight: 600,
    backgroundColor: isActive ? '#2563eb' : '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isActive 
      ? '0 4px 12px rgba(37, 99, 235, 0.3)' 
      : '0 2px 4px rgba(37, 99, 235, 0.1)',
    outline: 'none',
  });

  const buttonHoverStyle = {
    backgroundColor: '#3b82f6', // Lighter blue on hover
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
    transform: 'scale(1.02)',
  };

  // Add toggle function
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
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

      {/* Menu toggle button */}
      <button
        onClick={toggleMenu}
        onMouseEnter={(e) => {
          const btn = e.target as HTMLElement;
          btn.style.backgroundColor = 'rgba(30, 64, 175, 0.8)';
          btn.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          const btn = e.target as HTMLElement;
          btn.style.backgroundColor = 'rgba(30, 64, 175, 0.6)';
          btn.style.color = 'rgba(255, 255, 255, 0.8)';
        }}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '6px 12px',
          backgroundColor: 'rgba(30, 64, 175, 0.6)',
          color: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        {isMenuVisible ? '▲' : '▼'}
      </button>

      {/* Navigation bar with transition */}
      <div style={{ 
        width: '100%', 
        height: isMenuVisible ? '100px' : '0px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div 
          className="scrollable-menu"
          style={{ 
            width: '100%',
            height: '100px',
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              style={buttonStyle(currentPage === index)}
              onMouseEnter={(e) => {
                const btn = e.target as HTMLElement;
                Object.assign(btn.style, buttonHoverStyle);
              }}
              onMouseLeave={(e) => {
                const btn = e.target as HTMLElement;
                Object.assign(btn.style, buttonStyle(currentPage === index));
              }}
            >
              {page.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content area - adjust height based on menu visibility */}
      <div style={{ 
        width: '100%', 
        height: isMenuVisible ? 'calc(100vh - 100px)' : '100vh',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}>
        <iframe
          id="content-frame"
          src={currentUrl}
          title={pages[currentPage].title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
    </div>
  );
};

export default PageNavigator;