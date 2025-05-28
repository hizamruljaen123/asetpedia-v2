import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, DollarSign, Percent } from 'lucide-react';

interface RiskMetrics {
  positionSize: number;
  riskAmount: number;
  riskPercent: number;
  rewardRatio: number;
  breakeven: number;
  profitTarget: number;
  stopLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
  kellyPercent: number;
}

interface TradeSetup {
  symbol: string;
  entryPrice: number;
  targetPrice: number;
  stopLossPrice: number;
  accountSize: number;
  riskPercentage: number;
  winRate: number;
}

const RiskManagement: React.FC = () => {
  const [tradeSetup, setTradeSetup] = useState<TradeSetup>({
    symbol: 'AAPL',
    entryPrice: 150,
    targetPrice: 165,
    stopLossPrice: 140,
    accountSize: 10000,
    riskPercentage: 2,
    winRate: 60
  });

  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [portfolioRisks, setPortfolioRisks] = useState<any[]>([]);

  useEffect(() => {
    calculateRiskMetrics();
  }, [tradeSetup]);

  const calculateRiskMetrics = () => {
    const {
      entryPrice,
      targetPrice,
      stopLossPrice,
      accountSize,
      riskPercentage,
      winRate
    } = tradeSetup;

    // Calculate risk per share
    const riskPerShare = Math.abs(entryPrice - stopLossPrice);
    const rewardPerShare = Math.abs(targetPrice - entryPrice);
    
    // Calculate position sizing
    const riskAmount = (accountSize * riskPercentage) / 100;
    const positionSize = Math.floor(riskAmount / riskPerShare);
    const actualRiskAmount = positionSize * riskPerShare;
    const actualRiskPercent = (actualRiskAmount / accountSize) * 100;
    
    // Calculate reward to risk ratio
    const rewardRatio = rewardPerShare / riskPerShare;
    
    // Calculate breakeven
    const breakeven = entryPrice;
    
    // Calculate profit target amount
    const profitTarget = positionSize * rewardPerShare;
    
    // Calculate Kelly Criterion
    const p = winRate / 100; // Probability of winning
    const q = 1 - p; // Probability of losing
    const b = rewardRatio; // Odds received on the wager
    const kellyPercent = ((b * p - q) / b) * 100;
    
    // Simple Sharpe ratio estimation (this would need historical data in reality)
    const estimatedReturn = (p * rewardRatio - q) * 100;
    const estimatedVolatility = Math.sqrt(p * Math.pow(rewardRatio, 2) + q) * 100;
    const sharpeRatio = estimatedVolatility > 0 ? estimatedReturn / estimatedVolatility : 0;
    
    // Max drawdown estimation
    const maxDrawdown = actualRiskPercent * 3; // Simplified estimation

    setRiskMetrics({
      positionSize,
      riskAmount: actualRiskAmount,
      riskPercent: actualRiskPercent,
      rewardRatio,
      breakeven,
      profitTarget,
      stopLoss: actualRiskAmount,
      maxDrawdown,
      sharpeRatio,
      kellyPercent
    });
  };

  const addToPortfolio = () => {
    if (!riskMetrics) return;
    
    const newRisk = {
      id: Date.now(),
      symbol: tradeSetup.symbol,
      entryPrice: tradeSetup.entryPrice,
      positionSize: riskMetrics.positionSize,
      riskAmount: riskMetrics.riskAmount,
      riskPercent: riskMetrics.riskPercent,
      rewardRatio: riskMetrics.rewardRatio,
      addedAt: new Date()
    };
    
    setPortfolioRisks(prev => [newRisk, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const getTotalPortfolioRisk = () => {
    return portfolioRisks.reduce((total, risk) => total + risk.riskPercent, 0);
  };

  const getRiskLevel = (riskPercent: number): { label: string; color: string } => {
    if (riskPercent <= 1) return { label: 'Conservative', color: 'text-green-400' };
    if (riskPercent <= 2) return { label: 'Moderate', color: 'text-yellow-400' };
    if (riskPercent <= 5) return { label: 'Aggressive', color: 'text-orange-400' };
    return { label: 'Very High Risk', color: 'text-red-400' };
  };

  const getKellyRecommendation = (kellyPercent: number): { label: string; color: string } => {
    if (kellyPercent <= 0) return { label: 'Avoid Trade', color: 'text-red-400' };
    if (kellyPercent <= 5) return { label: 'Small Position', color: 'text-yellow-400' };
    if (kellyPercent <= 25) return { label: 'Good Opportunity', color: 'text-green-400' };
    return { label: 'Reduce Size', color: 'text-orange-400' };
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const riskLevel = riskMetrics ? getRiskLevel(riskMetrics.riskPercent) : null;
  const kellyRecommendation = riskMetrics ? getKellyRecommendation(riskMetrics.kellyPercent) : null;
  const totalPortfolioRisk = getTotalPortfolioRisk();

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
              Risk Management Calculator
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Trade Setup Input */}
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 mb-6">
            <h3 className="text-terminal-text font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Trade Setup Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  value={tradeSetup.symbol}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Entry Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tradeSetup.entryPrice}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, entryPrice: Number(e.target.value) }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tradeSetup.targetPrice}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, targetPrice: Number(e.target.value) }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Stop Loss ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tradeSetup.stopLossPrice}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, stopLossPrice: Number(e.target.value) }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Account Size ($)
                </label>
                <input
                  type="number"
                  value={tradeSetup.accountSize}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, accountSize: Number(e.target.value) }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Risk Per Trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tradeSetup.riskPercentage}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, riskPercentage: Number(e.target.value) }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                  Win Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tradeSetup.winRate}
                  onChange={(e) => setTradeSetup(prev => ({ ...prev, winRate: Number(e.target.value) }))}
                  className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={addToPortfolio}
                  className="w-full bg-terminal-accent text-terminal-bg px-4 py-2 rounded-md hover:bg-terminal-accent/80 transition-colors"
                >
                  Add to Portfolio
                </button>
              </div>
            </div>
          </div>

          {riskMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Position Sizing */}
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                <h3 className="text-terminal-text font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Position Sizing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Shares to Buy:</span>
                    <span className="text-terminal-text font-medium">
                      {riskMetrics.positionSize.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Total Investment:</span>
                    <span className="text-terminal-text font-medium">
                      {formatCurrency(riskMetrics.positionSize * tradeSetup.entryPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Risk Amount:</span>
                    <span className="text-red-400 font-medium">
                      {formatCurrency(riskMetrics.riskAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Risk Percentage:</span>
                    <span className={`font-medium ${riskLevel?.color}`}>
                      {riskMetrics.riskPercent.toFixed(2)}% ({riskLevel?.label})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Potential Profit:</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(riskMetrics.profitTarget)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                <h3 className="text-terminal-text font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Risk:Reward Ratio:</span>
                    <span className={`font-medium ${
                      riskMetrics.rewardRatio >= 2 ? 'text-green-400' : 
                      riskMetrics.rewardRatio >= 1 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      1:{riskMetrics.rewardRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Kelly Criterion:</span>
                    <span className={`font-medium ${kellyRecommendation?.color}`}>
                      {riskMetrics.kellyPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Recommendation:</span>
                    <span className={`font-medium ${kellyRecommendation?.color}`}>
                      {kellyRecommendation?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Sharpe Estimate:</span>
                    <span className="text-terminal-text font-medium">
                      {riskMetrics.sharpeRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Max Drawdown Est:</span>
                    <span className="text-red-400 font-medium">
                      {riskMetrics.maxDrawdown.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Risk Overview */}
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-terminal-text font-semibold flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Portfolio Risk Summary
              </h3>
              <div className="text-right">
                <div className="text-sm text-terminal-text/70">Total Portfolio Risk</div>
                <div className={`font-bold ${
                  totalPortfolioRisk <= 10 ? 'text-green-400' :
                  totalPortfolioRisk <= 20 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {totalPortfolioRisk.toFixed(1)}%
                </div>
              </div>
            </div>

            {portfolioRisks.length === 0 ? (
              <div className="text-center py-6 text-terminal-text/50">
                No positions added yet. Add your first trade setup above.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {portfolioRisks.map((risk) => (
                  <div
                    key={risk.id}
                    className="flex items-center justify-between p-3 bg-terminal-bg/20 border border-terminal-border/50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-terminal-text font-medium">{risk.symbol}</div>
                        <div className="text-sm text-terminal-text/70">
                          {risk.positionSize} shares @ {formatCurrency(risk.entryPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-medium">
                        {formatCurrency(risk.riskAmount)}
                      </div>
                      <div className="text-sm text-terminal-text/70">
                        {risk.riskPercent.toFixed(2)}% • 1:{risk.rewardRatio.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;
