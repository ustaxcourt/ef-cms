export const getOptionsForCategory = ({
  applicationContext,
  caseDetail,
  categoryInformation,
  selectedDocketEntryId,
}) => {
  let options = {};
  if (!categoryInformation) {
    return {}; // debugger-safe
  }

  switch (categoryInformation.scenario) {
    case 'Standard': {
      options = {
        showNonstandardForm: false,
      };
      break;
    }
    case 'Nonstandard A': {
      options = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(
          applicationContext,
          caseDetail,
          selectedDocketEntryId,
        ),
        showNonstandardForm: true,
      };
      break;
    }
    case 'Nonstandard B': {
      options = {
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard C': {
      options = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(
          applicationContext,
          caseDetail,
          selectedDocketEntryId,
        ),
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard D': {
      options = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(
          applicationContext,
          caseDetail,
          selectedDocketEntryId,
        ),
        showDateFields: true,
        showNonstandardForm: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard E': {
      options = {
        showNonstandardForm: true,
        showTrialLocationSelect: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard F': {
      options = {
        ordinalField: categoryInformation.ordinalField,
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(
          applicationContext,
          caseDetail,
          selectedDocketEntryId,
        ),
        showNonstandardForm: true,
      };
      break;
    }
    case 'Nonstandard G': {
      options = {
        ordinalField: categoryInformation.ordinalField,
        showNonstandardForm: true,
      };
      break;
    }
    case 'Nonstandard H': {
      options = {
        showNonstandardForm: true,
        showSecondaryDocumentSelect: true,
      };
      break;
    }
    case 'Nonstandard I': {
      options = {
        ordinalField: categoryInformation.ordinalField,
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard J': {
      options = {
        showNonstandardForm: true,
        showTextInput: true,
        showTextInput2: true,
        textInputLabel: categoryInformation.labelFreeText,
        textInputLabel2: categoryInformation.labelFreeText2,
      };
      break;
    }
  }

  return options;
};

export const MAX_TITLE_LENGTH = 100;

export const getPreviouslyFiledDocuments = (
  applicationContext,
  caseDetail,
  selectedDocketEntryId,
) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const withDocumentTitle = doc => {
    let documentTitle = applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo({ docketEntry: doc });
    if (documentTitle && documentTitle.length > MAX_TITLE_LENGTH) {
      documentTitle = documentTitle.substring(0, MAX_TITLE_LENGTH - 1) + '…';
    }
    return { ...doc, documentTitle };
  };

  return caseDetail.docketEntries
    .filter(
      doc =>
        doc.documentType !== INITIAL_DOCUMENT_TYPES.stin.documentType &&
        doc.docketEntryId !== selectedDocketEntryId,
    )
    .map(withDocumentTitle);
};
