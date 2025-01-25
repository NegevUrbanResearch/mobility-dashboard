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
    padding: '10px 20px',
    marginRight: '12px',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: isActive ? '#2563eb' : '#1e40af', // Bright blue when active, darker blue when inactive
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

      {/* Navigation bar - fixed height */}
      <div style={{ 
        width: '100%', 
        height: '80px', 
        backgroundColor: '#0f172a', // Dark blue background
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          padding: '0 24px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
          scrollbarWidth: 'none', // Hide scrollbar in Firefox
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
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

      {/* Content area - fills remaining height */}
      <div style={{ 
        width: '100%', 
        height: 'calc(100vh - 80px)',
        position: 'relative'
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