import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, DollarSign, Percent, Eye, Edit3 } from 'lucide-react';
import realMarketDataService from '../../services/realMarketDataService';

interface PortfolioPosition {
  id: string;
  symbol: string;
  name?: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
  timestamp: string;
}

interface AddPositionForm {
  symbol: string;
  shares: number;
  avgCost: number;
}

export const PortfolioTracker: React.FC = () => {
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<AddPositionForm>({
    symbol: '',
    shares: 0,
    avgCost: 0
  });

  // Load positions from localStorage on component mount
  useEffect(() => {
    const savedPositions = localStorage.getItem('portfolio-positions');
    if (savedPositions) {
      try {
        const parsed = JSON.parse(savedPositions);
        setPositions(parsed);
        updatePositionPrices(parsed);
      } catch (error) {
        console.error('Error loading saved positions:', error);
      }
    }
  }, []);

  // Save positions to localStorage whenever positions change
  useEffect(() => {
    if (positions.length > 0) {
      localStorage.setItem('portfolio-positions', JSON.stringify(positions));
    }
  }, [positions]);

  const updatePositionPrices = async (currentPositions: PortfolioPosition[] = positions) => {
    if (currentPositions.length === 0) return;

    try {
      setLoading(true);
      const symbols = currentPositions.map(pos => pos.symbol);
      const marketData = await realMarketDataService.fetchRealMarketData(symbols, true);

      const updatedPositions = currentPositions.map(position => {
        const marketInfo = marketData.find(data => data.symbol === position.symbol);
        if (marketInfo) {
          const marketValue = position.shares * marketInfo.price;
          const totalCost = position.shares * position.avgCost;
          const gainLoss = marketValue - totalCost;
          const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

          return {
            ...position,
            name: marketInfo.name || position.name,
            currentPrice: marketInfo.price,
            change: marketInfo.change,
            changePercent: marketInfo.changePercent,
            marketValue,
            totalCost,
            gainLoss,
            gainLossPercent,
            timestamp: marketInfo.timestamp
          };
        }
        return position;
      });

      setPositions(updatedPositions);
    } catch (error) {
      console.error('Error updating position prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPosition = async () => {
    if (!addForm.symbol || addForm.shares <= 0 || addForm.avgCost <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    try {
      // Check if position already exists
      if (positions.find(pos => pos.symbol.toLowerCase() === addForm.symbol.toLowerCase())) {
        alert('Position already exists. Use edit to modify existing positions.');
        return;
      }

      // Get current market data for the symbol
      const marketData = await realMarketDataService.fetchRealMarketData([addForm.symbol]);
      const marketInfo = marketData[0];

      if (!marketInfo) {
        alert('Could not fetch market data for this symbol');
        return;
      }

      const marketValue = addForm.shares * marketInfo.price;
      const totalCost = addForm.shares * addForm.avgCost;
      const gainLoss = marketValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

      const newPosition: PortfolioPosition = {
        id: Date.now().toString(),
        symbol: marketInfo.symbol,
        name: marketInfo.name,
        shares: addForm.shares,
        avgCost: addForm.avgCost,
        currentPrice: marketInfo.price,
        change: marketInfo.change,
        changePercent: marketInfo.changePercent,
        marketValue,
        totalCost,
        gainLoss,
        gainLossPercent,
        timestamp: marketInfo.timestamp
      };

      setPositions([...positions, newPosition]);
      setAddForm({ symbol: '', shares: 0, avgCost: 0 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding position:', error);
      alert('Error adding position. Please try again.');
    }
  };

  const removePosition = (id: string) => {
    if (confirm('Are you sure you want to remove this position?')) {
      const updatedPositions = positions.filter(pos => pos.id !== id);
      setPositions(updatedPositions);
      if (updatedPositions.length === 0) {
        localStorage.removeItem('portfolio-positions');
      }
    }
  };

  const updatePosition = async (id: string, shares: number, avgCost: number) => {
    const position = positions.find(pos => pos.id === id);
    if (!position) return;

    try {
      const marketData = await realMarketDataService.fetchRealMarketData([position.symbol]);
      const marketInfo = marketData[0];

      if (marketInfo) {
        const marketValue = shares * marketInfo.price;
        const totalCost = shares * avgCost;
        const gainLoss = marketValue - totalCost;
        const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

        const updatedPositions = positions.map(pos => 
          pos.id === id 
            ? {
                ...pos,
                shares,
                avgCost,
                marketValue,
                totalCost,
                gainLoss,
                gainLossPercent,
                currentPrice: marketInfo.price,
                change: marketInfo.change,
                changePercent: marketInfo.changePercent,
                timestamp: marketInfo.timestamp
              }
            : pos
        );

        setPositions(updatedPositions);
      }
    } catch (error) {
      console.error('Error updating position:', error);
    }
    
    setEditingPosition(null);
  };

  const getPortfolioSummary = () => {
    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalCost = positions.reduce((sum, pos) => sum + pos.totalCost, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    const dayChange = positions.reduce((sum, pos) => sum + (pos.shares * pos.change), 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      dayChange,
      dayChangePercent,
      positionCount: positions.length
    };
  };

  const summary = getPortfolioSummary();

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-terminal-accent font-semibold text-sm">Portfolio Tracker</span>
        </div>
      </div>
      <div className="terminal-content max-h-[800px] overflow-y-auto">
        
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-terminal-accent" />
              <span className="text-xs text-terminal-text/70">Total Value</span>
            </div>
            <div className="text-lg font-bold text-terminal-text">
              ${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-terminal-accent" />
              <span className="text-xs text-terminal-text/70">Total P&L</span>
            </div>
            <div className={`text-lg font-bold ${summary.totalGainLoss >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
              {summary.totalGainLoss >= 0 ? '+' : ''}${summary.totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs ${summary.totalGainLossPercent >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
              {summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-terminal-warning" />
              <span className="text-xs text-terminal-text/70">Day Change</span>
            </div>
            <div className={`text-lg font-bold ${summary.dayChange >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
              {summary.dayChange >= 0 ? '+' : ''}${summary.dayChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs ${summary.dayChangePercent >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
              {summary.dayChangePercent >= 0 ? '+' : ''}{summary.dayChangePercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-terminal-accent" />
              <span className="text-xs text-terminal-text/70">Positions</span>
            </div>
            <div className="text-lg font-bold text-terminal-text">{summary.positionCount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3 py-2 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Position
          </button>
          <button
            onClick={() => updatePositionPrices()}
            disabled={loading || positions.length === 0}
            className="px-3 py-2 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Refresh Prices'}
          </button>
        </div>

        {/* Add Position Form */}
        {showAddForm && (
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 mb-4">
            <h3 className="text-terminal-accent font-semibold mb-3">Add New Position</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-terminal-text/70 mb-1">Symbol</label>
                <input
                  type="text"
                  value={addForm.symbol}
                  onChange={(e) => setAddForm({...addForm, symbol: e.target.value.toUpperCase()})}
                  placeholder="AAPL"
                  className="w-full px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text"
                />
              </div>
              <div>
                <label className="block text-xs text-terminal-text/70 mb-1">Shares</label>
                <input
                  type="number"
                  value={addForm.shares || ''}
                  onChange={(e) => setAddForm({...addForm, shares: Number(e.target.value)})}
                  placeholder="100"
                  className="w-full px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text"
                />
              </div>
              <div>
                <label className="block text-xs text-terminal-text/70 mb-1">Avg Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={addForm.avgCost || ''}
                  onChange={(e) => setAddForm({...addForm, avgCost: Number(e.target.value)})}
                  placeholder="150.00"
                  className="w-full px-2 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addPosition}
                className="px-3 py-1 bg-terminal-accent text-terminal-bg rounded-md hover:bg-terminal-accent/80 transition-colors"
              >
                Add Position
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setAddForm({ symbol: '', shares: 0, avgCost: 0 });
                }}
                className="px-3 py-1 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Positions Table */}
        {positions.length > 0 ? (
          <div className="bg-terminal-bg/20 border border-terminal-border rounded-md overflow-hidden">
            <div className="bg-terminal-bg/30 border-b border-terminal-border p-2">
              <div className="grid grid-cols-8 gap-2 text-xs font-semibold text-terminal-text/70">
                <div>Symbol</div>
                <div className="text-right">Shares</div>
                <div className="text-right">Avg Cost</div>
                <div className="text-right">Current</div>
                <div className="text-right">Market Value</div>
                <div className="text-right">Day Change</div>
                <div className="text-right">Total P&L</div>
                <div className="text-center">Actions</div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {positions.map((position) => (
                <PositionRow
                  key={position.id}
                  position={position}
                  isEditing={editingPosition === position.id}
                  onEdit={() => setEditingPosition(position.id)}
                  onSave={(shares, avgCost) => updatePosition(position.id, shares, avgCost)}
                  onCancel={() => setEditingPosition(null)}
                  onRemove={() => removePosition(position.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-terminal-bg/20 border border-terminal-border rounded-md p-8 text-center">
            <DollarSign className="w-12 h-12 text-terminal-accent/50 mx-auto mb-3" />
            <p className="text-terminal-text/70 mb-2">No positions in your portfolio</p>
            <p className="text-terminal-text/50 text-sm">Add your first position to start tracking your investments</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface PositionRowProps {
  position: PortfolioPosition;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (shares: number, avgCost: number) => void;
  onCancel: () => void;
  onRemove: () => void;
}

const PositionRow: React.FC<PositionRowProps> = ({
  position,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRemove
}) => {
  const [editShares, setEditShares] = useState(position.shares);
  const [editAvgCost, setEditAvgCost] = useState(position.avgCost);

  const handleSave = () => {
    if (editShares > 0 && editAvgCost > 0) {
      onSave(editShares, editAvgCost);
    }
  };

  const handleCancel = () => {
    setEditShares(position.shares);
    setEditAvgCost(position.avgCost);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-8 gap-2 p-2 border-b border-terminal-border/30 bg-terminal-bg/40">
        <div className="text-sm font-semibold text-terminal-text">{position.symbol}</div>
        <div>
          <input
            type="number"
            value={editShares}
            onChange={(e) => setEditShares(Number(e.target.value))}
            className="w-full px-1 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-xs"
          />
        </div>
        <div>
          <input
            type="number"
            step="0.01"
            value={editAvgCost}
            onChange={(e) => setEditAvgCost(Number(e.target.value))}
            className="w-full px-1 py-1 bg-terminal-surface border border-terminal-border rounded text-terminal-text text-xs"
          />
        </div>
        <div className="text-right text-sm text-terminal-text">${position.currentPrice.toFixed(2)}</div>
        <div className="text-right text-sm text-terminal-text">
          ${(editShares * position.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-right text-sm ${position.changePercent >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
          {position.changePercent >= 0 ? '+' : ''}{position.changePercent.toFixed(2)}%
        </div>
        <div className={`text-right text-sm ${position.gainLoss >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
          {position.gainLoss >= 0 ? '+' : ''}${position.gainLoss.toFixed(2)}
        </div>
        <div className="flex gap-1 justify-center">
          <button
            onClick={handleSave}
            className="text-xs px-2 py-1 bg-terminal-accent text-terminal-bg rounded hover:bg-terminal-accent/80 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="text-xs px-2 py-1 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-8 gap-2 p-2 border-b border-terminal-border/30 hover:bg-terminal-bg/30 transition-colors">
      <div className="text-sm">
        <div className="font-semibold text-terminal-text">{position.symbol}</div>
        {position.name && (
          <div className="text-xs text-terminal-text/50 truncate">{position.name}</div>
        )}
      </div>
      <div className="text-right text-sm text-terminal-text">{position.shares}</div>
      <div className="text-right text-sm text-terminal-text">${position.avgCost.toFixed(2)}</div>
      <div className="text-right text-sm font-semibold text-terminal-text">${position.currentPrice.toFixed(2)}</div>
      <div className="text-right text-sm font-semibold text-terminal-text">
        ${position.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`text-right text-sm ${position.changePercent >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
        <div>{position.changePercent >= 0 ? '+' : ''}{position.changePercent.toFixed(2)}%</div>
        <div className="text-xs">
          {position.change >= 0 ? '+' : ''}${(position.shares * position.change).toFixed(2)}
        </div>
      </div>
      <div className={`text-right text-sm ${position.gainLoss >= 0 ? 'text-terminal-accent' : 'text-terminal-error'}`}>
        <div className="font-semibold">
          {position.gainLoss >= 0 ? '+' : ''}${position.gainLoss.toFixed(2)}
        </div>
        <div className="text-xs">
          {position.gainLossPercent >= 0 ? '+' : ''}{position.gainLossPercent.toFixed(2)}%
        </div>
      </div>
      <div className="flex gap-1 justify-center">
        <button
          onClick={onEdit}
          className="text-xs p-1 border border-terminal-border text-terminal-text hover:border-terminal-accent rounded transition-colors"
          title="Edit"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        <button
          onClick={onRemove}
          className="text-xs p-1 border border-terminal-border text-terminal-error hover:border-terminal-error rounded transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioTracker;
