export const formatDecimal = (price: string | number) => {
  const value = parseFloat(price.toString());
  return Math.round(value);
};
