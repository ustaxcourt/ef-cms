export const formatPositiveNumber = (number: number) =>
  new Intl.NumberFormat('en-US', { signDisplay: 'never' }).format(number);
