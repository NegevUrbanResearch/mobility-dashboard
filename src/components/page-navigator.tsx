import React, { useState, useEffect } from 'react';

interface Page {
  title: string;
  path: string;
}

const PageNavigator: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const pages: Page[] = [
    { title: 'Origin Index', path: 'pages/origin-index.html' },
    { title: 'Distance Visualization', path: 'pages/merged_distance_viz.html' },
    { title: 'Catchment Area', path: 'pages/catchment/index.html' },
    { title: 'Route Intensity', path: 'pages/route_intensity_interactive.html' },
    { title: 'Temporal Visualization', path: 'pages/temporal_visualization.html' },
    { title: 'Trip Animation', path: 'pages/trip_animation_time_dark_nolabels.html' },
    { title: 'Walking Arc', path: 'pages/walking_arc_visualization_glow.html' },
    { title: 'Walking Trip Animation', path: 'pages/walking_trip_animation.html' }
  ];

  const getPagePath = (path: string): string => {
    return `${process.env.PUBLIC_URL}/${path}`;
  };

  useEffect(() => {
    goToPage(0);
  }, []);

  const goToPage = (index: number): void => {
    setCurrentPage(index);
    const fullPath = getPagePath(pages[index].path);
    setCurrentUrl(fullPath);
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