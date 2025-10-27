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
  API_ENDPOINT_CONFIG: boolean;
  apiEndpoint?: string;
  authEndpoint?: string;
}

export type SyncStatus = 'synced' | 'pending' | 'failed';

interface CellItem {
  id: string;
  avatar: string;
  address: string;
  certificateNumber: string;
  owner: string;
  syncStatus: SyncStatus;
}

type AppState = 'loading' | 'login' | 'main';
type AuthMode = 'guest' | 'authenticated';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [authMode, setAuthMode] = useState<AuthMode>('guest');
  const [config, setConfig] = useState<EndpointsConfig | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [items, setItems] = useState<CellItem[]>(() => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileColumn, setMobileColumn] = useState<'left' | 'middle' | 'right'>('right');
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [rightExpanded, setRightExpanded] = useState(true);
  const [showApiNotification, setShowApiNotification] = useState(false);

  // Persist items to local storage
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  // Initialize app: fetch config, register SW, verify caching
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoadingProgress(33); // Step 1
        const endpointsResponse = await fetch('/endpoints.json');
        const endpointsData: EndpointsConfig = await endpointsResponse.json();
        setConfig(endpointsData);

        setLoadingProgress(66); // Step 2
        await new Promise(resolve => {
          if (navigator.serviceWorker.controller) return resolve(true);
          navigator.serviceWorker.addEventListener('controllerchange', () => resolve(true));
          setTimeout(() => resolve(true), 2000); // Fallback
        });

        setLoadingProgress(100); // Step 3
        await new Promise(resolve => setTimeout(resolve, 500));

        if (endpointsData.IDENTITY_PROVIDER_CONFIG) {
          setAppState('login');
        } else {
          setAuthMode('guest');
          setAppState('main');
        }
      } catch (error) {
        console.error('App initialization failed:', error);
        setAuthMode('guest');
        setAppState('main');
      }
    };

    initApp();
  }, []);

  // Handle responsive layout and gestures
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    if (!isMobile) return;

    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        if (mobileColumn === 'right') setMobileColumn('middle');
        else if (mobileColumn === 'middle') setMobileColumn('left');
      } else if (touchEndX - touchStartX > swipeThreshold) {
        if (mobileColumn === 'left') setMobileColumn('middle');
        else if (mobileColumn === 'middle') setMobileColumn('right');
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, mobileColumn]);

  const handleLogin = (mode: AuthMode) => {
    setAuthMode(mode);
    setAppState('main');
  };

  const updateItemSyncStatus = (itemId: string, syncStatus: SyncStatus) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, syncStatus } : item));
  };

  const handleAddItem = (newItem: Omit<CellItem, 'id' | 'syncStatus'>) => {
    const item: CellItem = {
      id: `item-${Date.now()}`,
      ...newItem,
      syncStatus: 'pending',
    };
    setItems(prev => [...prev, item]);
  };

  const handleSync = (itemId: string) => {
    if (!config?.API_ENDPOINT_CONFIG) {
      setShowApiNotification(true);
      return;
    }
    
    const itemToSync = items.find(item => item.id === itemId);
    if (!itemToSync) return;

    // Simulate API call
    updateItemSyncStatus(itemId, 'pending');
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate
      updateItemSyncStatus(itemId, isSuccess ? 'synced' : 'failed');
    }, 2000);
  };
  
  const selectedItem = items.find(item => item.id === selectedItemId);

  // Render app states
  if (appState === 'loading') {
    return (
      <div className="loading-screen">
        <img src="/logo.svg" alt="Logo" className="loading-logo" />
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${loadingProgress}%` }} /></div>
      </div>
    );
  }

  if (appState === 'login') {
    return (
      <div className="login-screen">
        <div className="login-container">
          <img src="/logo.svg" alt="Logo" className="login-logo" />
          <h2>Welcome</h2>
          <div className="login-form">
            <input type="email" placeholder="Enter your email" className="login-input" />
            <button className="login-button">Send OTP</button>
            <div className="login-divider">or</div>
            <button className="guest-button" onClick={() => handleLogin('guest')}>Continue as Guest</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar onMenuClick={() => {}} onSearch={() => {}} />
      
      <div className={`main-content ${isMobile ? 'mobile' : 'desktop'}`}>
        {isMobile ? (
          <>
            {mobileColumn === 'left' && <LeftColumn selectedItem={selectedItem} onNavigate={() => setMobileColumn('middle')} />}
            {mobileColumn === 'middle' && <MiddleColumn selectedItem={selectedItem} onNavigate={() => setMobileColumn('right')} />}
            {mobileColumn === 'right' && <RightColumn items={items} selectedItemId={selectedItemId} onSelectItem={setSelectedItemId} onSync={handleSync} />}
          </>
        ) : (
          <>
            <RightColumn items={items} selectedItemId={selectedItemId} onSelectItem={setSelectedItemId} onSync={handleSync} expanded={leftExpanded} onToggleExpand={() => setLeftExpanded(!leftExpanded)} />
            <MiddleColumn selectedItem={selectedItem} />
            <LeftColumn selectedItem={selectedItem} expanded={rightExpanded} onToggleExpand={() => setRightExpanded(!rightExpanded)} />
          </>
        )}
      </div>

      <FloatingBubble
        authMode={authMode}
        onAdd={handleAddItem}
        onLoginRequest={() => setAppState('login')}
        itemsLength={items.length}
      />

      {showApiNotification && (
        <div className="notification-modal">
          <div className="notification-content">
            <h3>Feature Disabled</h3>
            <p>This feature is currently disabled because the API endpoint is not configured.</p>
            <div className="notification-actions">
              <button className="btn" onClick={() => setShowApiNotification(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
