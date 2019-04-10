import { state } from 'cerebral';

const getOptionsForCategory = (
  caseDetail,
  trialCitiesHelper,
  categoryInformation,
) => {
  let options = {};

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
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
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
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard D': {
      options = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
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
        trialCities: trialCitiesHelper(caseDetail.procedureType)
          .trialCitiesByState,
      };
      break;
    }
    case 'Nonstandard F': {
      options = {
        ordinalField: categoryInformation.ordinalField,
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
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
  }

  return options;
};

const getPreviouslyFiledDocuments = caseDetail => {
  return caseDetail.documents
    .filter(
      document =>
        document.documentType !== 'Statement of Taxpayer Identification',
    )
    .map(document => {
      return document.documentType;
    });
};

export const selectDocumentTypeHelper = get => {
  const caseDetail = get(state.caseDetail);
  const trialCitiesHelper = get(state.trialCitiesHelper);

  let returnData = {};

  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const selectedDocumentCategory = get(state.form.category);
  const selectedDocumentType = get(state.form.documentType);
  const categoryInformation = CATEGORY_MAP[selectedDocumentCategory].find(
    entry => entry.documentType === selectedDocumentType,
  );

  returnData.primary = getOptionsForCategory(
    caseDetail,
    trialCitiesHelper,
    categoryInformation,
  );

  if (returnData.primary.showSecondaryDocumentSelect) {
    returnData.filteredSecondaryDocumentTypes = [];
  }

  const selectedSecondaryDocumentCategory = get(
    state.form.secondaryDocument.category,
  );
  if (selectedSecondaryDocumentCategory) {
    if (categoryInformation.scenario === 'Nonstandard H') {
      returnData.filteredSecondaryDocumentTypes = CATEGORY_MAP[
        selectedSecondaryDocumentCategory
      ].filter(entry => entry.scenario !== 'Nonstandard H');
    }

    const selectedSecondaryDocumentType = get(
      state.form.secondaryDocument.documentType,
    );

    if (selectedSecondaryDocumentType) {
      const secondaryCategoryInformation = CATEGORY_MAP[
        selectedSecondaryDocumentCategory
      ].find(entry => entry.documentType === selectedSecondaryDocumentType);

      returnData.secondary = getOptionsForCategory(
        caseDetail,
        trialCitiesHelper,
        secondaryCategoryInformation,
      );
    }
  }

  return returnData;
};
