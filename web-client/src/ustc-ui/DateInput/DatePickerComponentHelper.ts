export const getComputedInputValue = ({ day, month, year }) => {
  if (month && day && year) {
    return `${month}/${day}/${year}`;
  } else return '';
};
