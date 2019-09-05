export const fileDocumentPrimaryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      updateSequence({
        key: 'category',
        value: inputValue.category,
      });
      updateSequence({
        key: 'documentType',
        value: inputValue.documentType,
      });
      updateSequence({
        key: 'documentTitle',
        value: inputValue.documentTitle,
      });
      updateSequence({
        key: 'eventCode',
        value: inputValue.eventCode,
      });
      updateSequence({
        key: 'scenario',
        value: inputValue.scenario,
      });
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: 'category',
        value: '',
      });
      validateSequence();
      break;
  }
};

export const fileDocumentSecondaryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      updateSequence({
        key: 'secondaryDocument.category',
        value: inputValue.category,
      });
      updateSequence({
        key: 'secondaryDocument.documentType',
        value: inputValue.documentType,
      });
      updateSequence({
        key: 'secondaryDocument.documentTitle',
        value: inputValue.documentTitle,
      });
      updateSequence({
        key: 'secondaryDocument.eventCode',
        value: inputValue.eventCode,
      });
      updateSequence({
        key: 'secondaryDocument.scenario',
        value: inputValue.scenario,
      });
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: 'secondaryDocument.category',
        value: '',
      });
      validateSequence();
      break;
  }
};

export const docketEntryOnChange = ({
  action,
  inputValue,
  name,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      updateSequence({
        key: name,
        value: inputValue.value,
      });
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: name,
        value: '',
      });
      validateSequence();
      break;
  }
  return true;
};

export const onInputChange = ({ action, inputText, updateSequence }) => {
  if (action === 'input-change') {
    updateSequence({
      key: 'searchText',
      value: inputText,
    });
  }
};

export const reactSelectValue = ({ documentTypes, selectedEventCode }) => {
  return documentTypes.filter(option => option.eventCode === selectedEventCode);
};
