export const reactSelectValue = ({ documentTypes, selectedEventCode }) => {
  return documentTypes.filter(option => option.eventCode === selectedEventCode);
};
