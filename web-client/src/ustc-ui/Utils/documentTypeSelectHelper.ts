export const fileDocumentPrimaryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      [
        'category',
        'documentType',
        'documentTitle',
        'eventCode',
        'scenario',
      ].forEach(key =>
        updateSequence({
          key,
          value: inputValue[key],
        }),
      );
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
      [
        'category',
        'documentType',
        'documentTitle',
        'eventCode',
        'scenario',
      ].forEach(key =>
        updateSequence({
          key: `secondaryDocument.${key}`,
          value: inputValue[key],
        }),
      );
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
  inputName,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      updateSequence({
        key: inputName,
        value: inputValue.value,
      });
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: inputName,
        value: '',
      });
      validateSequence();
      break;
  }
  return true;
};

export const courtIssuedDocketEntryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  const updateFieldsAndValidate = (clearFields = false) => {
    ['documentType', 'documentTitle', 'eventCode', 'scenario'].forEach(key =>
      updateSequence({
        key,
        value: clearFields ? '' : inputValue[key],
      }),
    );
    validateSequence();
  };

  switch (action) {
    case 'select-option':
      updateFieldsAndValidate();
      break;
    case 'clear':
      updateFieldsAndValidate(true);
      break;
  }
};

export const irsCalendarAdminInfoOnChange = ({
  action,
  inputValue,
  updateTrialSessionFormDataSequence,
}) => {
  switch (action) {
    case 'select-option':
      ['name', 'email', 'phone'].forEach(key =>
        updateTrialSessionFormDataSequence({
          key: `irsCalendarAdministratorInfo.${key}`,
          value: inputValue[key],
        }),
      );
      break;
    case 'clear':
      updateTrialSessionFormDataSequence({
        key: 'irsCalendarAdministratorInfo',
        value: {},
      });
      break;
  }
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
