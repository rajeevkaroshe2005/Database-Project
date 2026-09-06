import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext(null);

export const currencies = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€)' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 0.044, label: 'AED (د.إ)' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');

  const formatPrice = (inrAmount) => {
    if (inrAmount == null || isNaN(inrAmount)) return '0';
    const active = currencies[currency] || currencies.INR;
    const converted = inrAmount * active.rate;

    if (active.code === 'INR') {
      return `${active.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${active.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currencyConfig: currencies[currency] || currencies.INR,
        allCurrencies: Object.values(currencies)
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
