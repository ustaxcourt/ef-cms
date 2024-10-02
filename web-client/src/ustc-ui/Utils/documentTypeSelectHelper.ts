export const onInputChange = ({ inputText, updateSequence }) => {
  updateSequence({
    key: 'searchText',
    value: inputText,
  });
};

export const reactSelectValue = ({ documentTypes, selectedEventCode }) => {
  return documentTypes.filter(option => option.eventCode === selectedEventCode);
};
