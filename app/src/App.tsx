import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import RightColumn from './components/RightColumn';
import MiddleColumn from './components/MiddleColumn';
import LeftColumn from './components/LeftColumn';
import FloatingBubble from './components/FloatingBubble';
import './App.css';

// Types
interface EndpointsConfig {
  IDENTITY_PROVIDER_CONFIG: boolean;
  UPLOAD_API_CONFIG: boolean;
  // TODO: Add other endpoint keys as needed
  uploadEndpoint?: string;
  authEndpoint?: string;
}

interface CellItem {
  id: string;
  avatar: string;
  address: string;
  certificateNumber: string;
  owner: string;
}

type AppState = 'loading' | 'login' | 'main';
type AuthMode = 'guest' | 'authenticated';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [authMode, setAuthMode] = useState<AuthMode>('guest');
  const [config, setConfig] = useState<EndpointsConfig | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [items, setItems] = useState<CellItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileColumn, setMobileColumn] = useState<'left' | 'middle' | 'right'>('right');
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [rightExpanded, setRightExpanded] = useState(true);

  // Initialize app: fetch config, register SW, verify caching
  useEffect(() => {
    const initApp = async () => {
      try {
        // Step 1: Fetch endpoints.json (33% progress)
        setLoadingProgress(33);
        const endpointsResponse = await fetch('/endpoints.json');
        const endpointsData: EndpointsConfig = await endpointsResponse.json();
        setConfig(endpointsData);

        // Step 2: Wait for Service Worker registration (66% progress)
        setLoadingProgress(66);
        await new Promise((resolve) => {
          if (navigator.serviceWorker.controller) {
            resolve(true);
          } else {
            navigator.serviceWorker.addEventListener('controllerchange', () => resolve(true));
            setTimeout(() => resolve(true), 2000); // Fallback timeout
          }
        });

        // Step 3: Verify asset caching version (100% progress)
        setLoadingProgress(100);
        // TODO: Implement latest-version check against cached assets
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Determine next state based on config
        if (endpointsData.IDENTITY_PROVIDER_CONFIG) {
          setAppState('login');
        } else {
          setAuthMode('guest');
          setAppState('main');
        }
      } catch (error) {
        console.error('App initialization failed:', error);
        // Fallback to guest mode on error
        setAuthMode('guest');
        setAppState('main');
      }
    };

    initApp();
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mobile swipe gestures
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left
        if (mobileColumn === 'right') setMobileColumn('middle');
        else if (mobileColumn === 'middle') setMobileColumn('left');
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right
        if (mobileColumn === 'left') setMobileColumn('middle');
        else if (mobileColumn === 'middle') setMobileColumn('right');
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, mobileColumn]);

  const handleLogin = (mode: AuthMode) => {
    setAuthMode(mode);
    setAppState('main');
  };

  const handleAddItem = (newItem: Omit<CellItem, 'id'>) => {
    const item: CellItem = {
      id: `item-${Date.now()}`,
      ...newItem,
    };
    setItems((prev) => [...prev, item]);
  };

  const selectedItem = items.find((item) => item.id === selectedItemId);

  // Loading screen
  if (appState === 'loading') {
    return (
      <div className="loading-screen">
        <img src="/vite.svg" alt="Logo" className="loading-logo" />
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${loadingProgress}%` }} />
        </div>
      </div>
    );
  }

  // Login screen
  if (appState === 'login') {
    return (
      <div className="login-screen">
        <div className="login-container">
          <img src="/vite.svg" alt="Logo" className="login-logo" />
          <h2>Welcome</h2>
          <div className="login-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input"
              aria-label="Email address"
            />
            <button className="login-button" aria-label="Login with OTP">
              Send OTP
            </button>
            <div className="login-divider">or</div>
            <button
              className="guest-button"
              onClick={() => handleLogin('guest')}
              aria-label="Continue as guest"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main screen
  return (
    <div className="app">
      <TopBar
        onMenuClick={() => {
          // Toggle menu or navigation
        }}
        onSearch={(query) => {
          console.log('Search:', query);
        }}
      />
      
      <div className={`main-content ${isMobile ? 'mobile' : 'desktop'}`}>
        {isMobile ? (
          // Mobile: Single column with swipe navigation
          <>
            {mobileColumn === 'left' && (
              <LeftColumn
                selectedItem={selectedItem}
                onNavigate={() => setMobileColumn('middle')}
              />
            )}
            {mobileColumn === 'middle' && (
              <MiddleColumn
                selectedItem={selectedItem}
                onNavigate={() => setMobileColumn('right')}
              />
            )}
            {mobileColumn === 'right' && (
              <RightColumn
                items={items}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onAddItem={handleAddItem}
                uploadEnabled={config?.UPLOAD_API_CONFIG ?? false}
              />
            )}
          </>
        ) : (
          // Desktop: Three columns
          <>
            <LeftColumn
              selectedItem={selectedItem}
              expanded={leftExpanded}
              onToggleExpand={() => setLeftExpanded(!leftExpanded)}
            />
            <MiddleColumn selectedItem={selectedItem} />
            <RightColumn
              items={items}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onAddItem={handleAddItem}
              uploadEnabled={config?.UPLOAD_API_CONFIG ?? false}
              expanded={rightExpanded}
              onToggleExpand={() => setRightExpanded(!rightExpanded)}
            />
          </>
        )}
      </div>

      {items.length > 0 && (
        <FloatingBubble
          authMode={authMode}
          onAdd={handleAddItem}
          uploadEnabled={config?.UPLOAD_API_CONFIG ?? false}
          onLoginRequest={() => setAppState('login')}
        />
      )}
    </div>
  );
}

export default App;