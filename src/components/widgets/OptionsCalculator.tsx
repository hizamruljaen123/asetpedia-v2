import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Info } from 'lucide-react';

interface OptionCalculation {
  intrinsicValue: number;
  timeValue: number;
  totalValue: number;
  breakeven: number;
  maxProfit: number;
  maxLoss: number;
  probabilityOfProfit: number;
}

interface GreeksCalculation {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

const OptionsCalculator: React.FC = () => {
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [premium, setPremium] = useState<number>(5);
  const [volatility, setVolatility] = useState<number>(25);
  const [daysToExpiration, setDaysToExpiration] = useState<number>(30);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1);
  
  const [calculation, setCalculation] = useState<OptionCalculation | null>(null);
  const [greeks, setGreeks] = useState<GreeksCalculation | null>(null);

  // Black-Scholes calculations
  const calculateOption = () => {
    const S = underlyingPrice; // Current stock price
    const K = strikePrice; // Strike price
    const T = daysToExpiration / 365; // Time to expiration in years
    const r = riskFreeRate / 100; // Risk-free rate
    const sigma = volatility / 100; // Volatility

    // Calculate d1 and d2
    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    // Standard normal cumulative distribution function
    const normCDF = (x: number): number => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)));
    };

    // Error function approximation
    const erf = (x: number): number => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x >= 0 ? 1 : -1;
      x = Math.abs(x);
      
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return sign * y;
    };

    let theoreticalValue: number;
    let delta: number;
    
    if (optionType === 'call') {
      theoreticalValue = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
      delta = normCDF(d1);
    } else {
      theoreticalValue = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
      delta = normCDF(d1) - 1;
    }

    // Calculate Greeks
    const gamma = Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(2 * Math.PI * T));
    const theta = optionType === 'call' 
      ? (-S * Math.exp(-d1 * d1 / 2) * sigma / (2 * Math.sqrt(2 * Math.PI * T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365
      : (-S * Math.exp(-d1 * d1 / 2) * sigma / (2 * Math.sqrt(2 * Math.PI * T)) + r * K * Math.exp(-r * T) * normCDF(-d2)) / 365;
    const vega = S * Math.exp(-d1 * d1 / 2) * Math.sqrt(T) / (Math.sqrt(2 * Math.PI) * 100);
    const rho = optionType === 'call'
      ? K * T * Math.exp(-r * T) * normCDF(d2) / 100
      : -K * T * Math.exp(-r * T) * normCDF(-d2) / 100;

    // Calculate intrinsic and time value
    let intrinsicValue: number;
    if (optionType === 'call') {
      intrinsicValue = Math.max(0, S - K);
    } else {
      intrinsicValue = Math.max(0, K - S);
    }
    
    const timeValue = premium - intrinsicValue;

    // Calculate breakeven
    const breakeven = optionType === 'call' ? K + premium : K - premium;

    // Calculate max profit/loss
    let maxProfit: number;
    let maxLoss: number;
    
    if (optionType === 'call') {
      maxProfit = Infinity; // Theoretically unlimited for long calls
      maxLoss = premium * quantity * 100;
    } else {
      maxProfit = (K - premium) * quantity * 100;
      maxLoss = premium * quantity * 100;
    }

    // Simple probability calculation (this is a rough estimate)
    const probabilityOfProfit = optionType === 'call' 
      ? (1 - normCDF((Math.log(breakeven / S)) / (sigma * Math.sqrt(T)))) * 100
      : normCDF((Math.log(breakeven / S)) / (sigma * Math.sqrt(T))) * 100;

    setCalculation({
      intrinsicValue,
      timeValue,
      totalValue: theoreticalValue,
      breakeven,
      maxProfit: maxProfit === Infinity ? Infinity : maxProfit,
      maxLoss,
      probabilityOfProfit
    });

    setGreeks({
      delta: delta * 100,
      gamma: gamma * 100,
      theta,
      vega,
      rho
    });
  };

  useEffect(() => {
    calculateOption();
  }, [optionType, underlyingPrice, strikePrice, premium, volatility, daysToExpiration, riskFreeRate, quantity]);

  const formatCurrency = (value: number): string => {
    if (value === Infinity) return '∞';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getMoneyness = (): { status: string; color: string } => {
    if (optionType === 'call') {
      if (underlyingPrice > strikePrice) return { status: 'In-the-Money', color: 'text-green-400' };
      if (underlyingPrice === strikePrice) return { status: 'At-the-Money', color: 'text-yellow-400' };
      return { status: 'Out-of-the-Money', color: 'text-red-400' };
    } else {
      if (underlyingPrice < strikePrice) return { status: 'In-the-Money', color: 'text-green-400' };
      if (underlyingPrice === strikePrice) return { status: 'At-the-Money', color: 'text-yellow-400' };
      return { status: 'Out-of-the-Money', color: 'text-red-400' };
    }
  };

  const moneyness = getMoneyness();

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
              Options Trading Calculator
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Input Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Option Type
              </label>
              <select
                value={optionType}
                onChange={(e) => setOptionType(e.target.value as 'call' | 'put')}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Underlying Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={underlyingPrice}
                onChange={(e) => setUnderlyingPrice(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Strike Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={strikePrice}
                onChange={(e) => setStrikePrice(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Premium ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Volatility (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={volatility}
                onChange={(e) => setVolatility(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Days to Expiration
              </label>
              <input
                type="number"
                value={daysToExpiration}
                onChange={(e) => setDaysToExpiration(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Risk-Free Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-text/70 mb-1">
                Contracts
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-terminal-surface border border-terminal-border rounded-md px-3 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent/50"
              />
            </div>
          </div>

          {/* Option Status */}
          <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-terminal-accent" />
                <span className="text-terminal-text font-medium">
                  {optionType.toUpperCase()} Option Status
                </span>
              </div>
              <div className={`font-semibold ${moneyness.color}`}>
                {moneyness.status}
              </div>
            </div>
          </div>

          {calculation && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option Valuation */}
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                <h3 className="text-terminal-text font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Option Valuation
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Intrinsic Value:</span>
                    <span className="text-terminal-text font-medium">
                      {formatCurrency(calculation.intrinsicValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Time Value:</span>
                    <span className="text-terminal-text font-medium">
                      {formatCurrency(calculation.timeValue)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-terminal-border pt-2">
                    <span className="text-terminal-text/70">Theoretical Value:</span>
                    <span className="text-terminal-accent font-bold">
                      {formatCurrency(calculation.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Current Premium:</span>
                    <span className="text-terminal-text font-medium">
                      {formatCurrency(premium)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Over/Under Valued:</span>
                    <span className={`font-medium ${
                      premium > calculation.totalValue ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {formatCurrency(premium - calculation.totalValue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4">
                <h3 className="text-terminal-text font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Risk Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Breakeven:</span>
                    <span className="text-terminal-text font-medium">
                      {formatCurrency(calculation.breakeven)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Max Profit:</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(calculation.maxProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Max Loss:</span>
                    <span className="text-red-400 font-medium">
                      {formatCurrency(calculation.maxLoss)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Probability of Profit:</span>
                    <span className="text-terminal-accent font-medium">
                      {formatPercent(calculation.probabilityOfProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-terminal-text/70">Total Investment:</span>
                    <span className="text-terminal-text font-medium">
                      {formatCurrency(premium * quantity * 100)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Greeks */}
              {greeks && (
                <div className="bg-terminal-bg/30 border border-terminal-border rounded-md p-4 lg:col-span-2">
                  <h3 className="text-terminal-text font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    The Greeks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-terminal-text/70 text-sm mb-1">Delta</div>
                      <div className="text-terminal-text font-medium">
                        {greeks.delta.toFixed(2)}
                      </div>
                      <div className="text-xs text-terminal-text/50">Price sensitivity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-terminal-text/70 text-sm mb-1">Gamma</div>
                      <div className="text-terminal-text font-medium">
                        {greeks.gamma.toFixed(4)}
                      </div>
                      <div className="text-xs text-terminal-text/50">Delta sensitivity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-terminal-text/70 text-sm mb-1">Theta</div>
                      <div className="text-terminal-text font-medium">
                        {greeks.theta.toFixed(3)}
                      </div>
                      <div className="text-xs text-terminal-text/50">Time decay</div>
                    </div>
                    <div className="text-center">
                      <div className="text-terminal-text/70 text-sm mb-1">Vega</div>
                      <div className="text-terminal-text font-medium">
                        {greeks.vega.toFixed(3)}
                      </div>
                      <div className="text-xs text-terminal-text/50">Volatility sensitivity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-terminal-text/70 text-sm mb-1">Rho</div>
                      <div className="text-terminal-text font-medium">
                        {greeks.rho.toFixed(3)}
                      </div>
                      <div className="text-xs text-terminal-text/50">Interest rate sensitivity</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsCalculator;
