import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';

interface Alert {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'volume_spike' | 'percent_change';
  value: number;
  currentValue?: number;
  triggered: boolean;
  createdAt: Date;
  message: string;
}

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  addedAt: Date;
}

const TradingAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'price_above' as Alert['type'],
    value: 0,
    message: ''
  });
  const [newWatchSymbol, setNewWatchSymbol] = useState('');
  const [activeTab, setActiveTab] = useState<'alerts' | 'watchlist'>('alerts');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('trading_alerts');
    const savedWatchlist = localStorage.getItem('trading_watchlist');
    
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts).map((alert: any) => ({
        ...alert,
        createdAt: new Date(alert.createdAt)
      })));
    }
    
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist).map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      })));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('trading_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('trading_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return;
    
    const alert: Alert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      type: newAlert.type,
      value: newAlert.value,
      triggered: false,
      createdAt: new Date(),
      message: newAlert.message || `${newAlert.symbol.toUpperCase()} ${newAlert.type.replace('_', ' ')} ${newAlert.value}`
    };
    
    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ symbol: '', type: 'price_above', value: 0, message: '' });
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const addToWatchlist = () => {
    if (!newWatchSymbol) return;
    
    const symbol = newWatchSymbol.toUpperCase();
    if (watchlist.some(item => item.symbol === symbol)) return;
    
    // Mock data for demonstration - in real app, fetch from API
    const newItem: WatchlistItem = {
      symbol,
      name: `Company ${symbol}`,
      price: Math.random() * 1000 + 50,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 10000000),
      addedAt: new Date()
    };
    
    setWatchlist(prev => [newItem, ...prev]);
    setNewWatchSymbol('');
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price_above': return <TrendingUp className="w-4 h-4" />;
      case 'price_below': return <TrendingDown className="w-4 h-4" />;
      case 'volume_spike': return <BarChart3 className="w-4 h-4" />;
      case 'percent_change': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-terminal-accent font-semibold">
              Trading Alerts & Watchlist
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'alerts'
                  ? 'bg-terminal-accent text-terminal-bg'
                  : 'border border-terminal-border text-terminal-text hover:border-terminal-accent'
              }`}
            >
              <Bell className="w-4 h-4" />
              Alerts ({alerts.filter(a => !a.triggered).length})
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'watchlist'
                  ? 'bg-terminal-accent text-terminal-bg'
                  : 'border border-terminal-border text-terminal-text hover:border-terminal-accent'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Watchlist ({watchlist.length})
            </button>
          </div>

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {/* Add New Alert */}
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                <h3 className="text-terminal-text font-semibold mb-3">Create New Alert</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Symbol (e.g., AAPL)"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, symbol: e.target.value }))}
                    className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                  />
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value as Alert['type'] }))}
                    className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                  >
                    <option value="price_above">Price Above</option>
                    <option value="price_below">Price Below</option>
                    <option value="volume_spike">Volume Spike</option>
                    <option value="percent_change">% Change</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Value"
                    value={newAlert.value || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                  />
                  <button
                    onClick={addAlert}
                    className="bg-terminal-accent text-terminal-bg px-4 py-2 rounded-md hover:bg-terminal-accent/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Alert
                  </button>
                </div>
              </div>

              {/* Active Alerts */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-terminal-text/50">
                    No alerts created yet. Create your first alert above.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`bg-terminal-bg/30 border rounded-md p-3 flex items-center justify-between ${
                        alert.triggered ? 'border-red-500 bg-red-500/10' : 'border-terminal-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${alert.triggered ? 'text-red-400' : 'text-terminal-accent'}`}>
                          {alert.triggered ? <BellRing className="w-4 h-4" /> : getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <div className="text-terminal-text font-medium">
                            {alert.symbol} - {alert.message}
                          </div>
                          <div className="text-sm text-terminal-text/70">
                            Created: {alert.createdAt.toLocaleDateString()}
                            {alert.triggered && (
                              <span className="ml-2 text-red-400 font-medium">TRIGGERED</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              {/* Add to Watchlist */}
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                <h3 className="text-terminal-text font-semibold mb-3">Add to Watchlist</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Symbol (e.g., AAPL)"
                    value={newWatchSymbol}
                    onChange={(e) => setNewWatchSymbol(e.target.value)}
                    className="flex-1 bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                  />
                  <button
                    onClick={addToWatchlist}
                    className="bg-terminal-accent text-terminal-bg px-4 py-2 rounded-md hover:bg-terminal-accent/80 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Watchlist Items */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {watchlist.length === 0 ? (
                  <div className="text-center py-8 text-terminal-text/50">
                    No symbols in your watchlist. Add some above.
                  </div>
                ) : (
                  watchlist.map((item) => (
                    <div
                      key={item.symbol}
                      className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-terminal-text font-medium">{item.symbol}</div>
                          <div className="text-sm text-terminal-text/70">{item.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-terminal-text font-medium">${item.price.toFixed(2)}</div>
                          <div className={`text-sm flex items-center gap-1 ${
                            item.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {item.changePercent.toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-terminal-text/70">Volume</div>
                          <div className="text-sm text-terminal-text">{formatNumber(item.volume)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(item.symbol)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingAlerts;
