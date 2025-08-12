/**
 * Helper function to format numbers with appropriate precision
 */
export const formatTokenAmount = (amount: number, decimals: number = 6): string => {
  if (amount === 0) return '0';
  if (amount < Math.pow(10, -decimals)) return `< ${Math.pow(10, -decimals)}`;
  
  // Use significant digits for very small numbers
  if (amount < 0.01) {
    return amount.toPrecision(3);
  }
  
  // Use fixed decimals for larger numbers, removing trailing zeros
  return amount.toFixed(Math.min(decimals, 6)).replace(/\.?0+$/, '');
};

// Format token amount with proper decimals based on token configuration
export const formatTokenAmountWithDecimals = (amount: number, token: { decimals?: number }): string => {
  const decimals = token.decimals || 6;
  return formatTokenAmount(amount, decimals);
};