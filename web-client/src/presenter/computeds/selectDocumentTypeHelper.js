import { isEmpty } from 'lodash';
import { sortBy } from 'lodash';
import { state } from 'cerebral';

const getOptionsForCategory = (caseDetail, categoryInformation) => {
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
      return document.documentTitle || document.documentType;
    });
};

export const selectDocumentTypeHelper = get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  let returnData = {};
  if (isEmpty(caseDetail)) {
    return {};
  }

  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const selectedDocumentCategory = form.category;
  const selectedDocumentType = form.documentType;
  const categoryInformation = (
    CATEGORY_MAP[selectedDocumentCategory] || []
  ).find(entry => entry.documentType === selectedDocumentType);

  returnData.primary = getOptionsForCategory(caseDetail, categoryInformation);

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
          caseDetail,
          secondaryCategoryInformation,
        );
      }
    }
  }

  if (
    returnData.primary.showTrialLocationSelect ||
    (returnData.secondary && returnData.secondary.showTrialLocationSelect)
  ) {
    const { TRIAL_CITIES } = get(state.constants);
    let trialCities =
      caseDetail.procedureType === 'Small'
        ? TRIAL_CITIES.SMALL
        : TRIAL_CITIES.REGULAR;
    trialCities = sortBy(trialCities, ['state', 'city']);
    const getTrialCityName = get(state.getTrialCityName);
    const states = {};
    trialCities.forEach(
      trialCity =>
        (states[trialCity.state] = [
          ...(states[trialCity.state] || []),
          getTrialCityName(trialCity),
        ]),
    );
    returnData.trialCities = states;
  }

  return returnData;
};
