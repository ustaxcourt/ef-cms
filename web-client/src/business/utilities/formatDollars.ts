export const formatDollars = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
}).format;
