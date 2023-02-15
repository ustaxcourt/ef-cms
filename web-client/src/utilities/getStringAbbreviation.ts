export const getStringAbbreviation = (
  originalString,
  maxLength,
  useEllipsis = true,
) => {
  const ellipsis = useEllipsis ? '…' : '';
  if (originalString.length <= maxLength) {
    return originalString;
  }
  const abbreviated = `${originalString.substr(0, maxLength)}${ellipsis}`;
  return abbreviated;
};
