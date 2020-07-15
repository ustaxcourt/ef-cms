import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const getOptionsForCategory = (
  applicationContext,
  caseDetail,
  categoryInformation,
) => {
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

export const getPreviouslyFiledDocuments = (
  applicationContext,
  caseDetail,
  documentIdWhitelist,
) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  return caseDetail.documents
    .filter(
      document =>
        document.documentType !== INITIAL_DOCUMENT_TYPES.stin.documentType,
    )
    .filter(
      document =>
        !documentIdWhitelist ||
        documentIdWhitelist.includes(document.documentId),
    );
};

export const selectDocumentTypeHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  let returnData = {};
  if (isEmpty(caseDetail)) {
    return {};
  }

  const { CATEGORY_MAP } = applicationContext.getConstants();

  const selectedDocumentCategory = form.category;
  const selectedDocumentType = form.documentType;
  const categoryInformation = (
    CATEGORY_MAP[selectedDocumentCategory] || []
  ).find(entry => entry.documentType === selectedDocumentType);

  returnData.primary = getOptionsForCategory(
    applicationContext,
    caseDetail,
    categoryInformation,
  );

  if (returnData.primary.showSecondaryDocumentSelect) {
    returnData.filteredSecondaryDocumentTypes = [];
  }

  if (form.secondaryDocument) {
    const selectedSecondaryDocumentCategory = form.secondaryDocument.category;
    if (selectedSecondaryDocumentCategory) {
      if (categoryInformation.scenario === 'Nonstandard H') {
        returnData.filteredSecondaryDocumentTypes = CATEGORY_MAP[
          selectedSecondaryDocumentCategory
        ].filter(entry => entry.scenario !== 'Nonstandard H');
      }

      const selectedSecondaryDocumentType = form.secondaryDocument.documentType;
      if (selectedSecondaryDocumentType) {
        const secondaryCategoryInformation = CATEGORY_MAP[
          selectedSecondaryDocumentCategory
        ].find(entry => entry.documentType === selectedSecondaryDocumentType);

        returnData.secondary = getOptionsForCategory(
          applicationContext,
          caseDetail,
          secondaryCategoryInformation,
        );
      }
    }
  }

  return returnData;
};
