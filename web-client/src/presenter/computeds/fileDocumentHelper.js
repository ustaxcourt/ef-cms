import { state } from 'cerebral';

const getFileDocumentDataForCategory = (
  caseDetail,
  trialCitiesHelper,
  categoryInformation,
) => {
  let fileDocumentData = {};

  switch (categoryInformation.scenario) {
    case 'Standard': {
      fileDocumentData = {
        showNonstandardForm: false,
      };
      break;
    }
    case 'Nonstandard A': {
      fileDocumentData = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
        showNonstandardForm: true,
      };
      break;
    }
    case 'Nonstandard B': {
      fileDocumentData = {
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard C': {
      fileDocumentData = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
        showNonstandardForm: true,
        showTextInput: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard D': {
      fileDocumentData = {
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
        showDateFields: true,
        showNonstandardForm: true,
        textInputLabel: categoryInformation.labelFreeText,
      };
      break;
    }
    case 'Nonstandard E': {
      fileDocumentData = {
        showNonstandardForm: true,
        showTrialLocationSelect: true,
        textInputLabel: categoryInformation.labelFreeText,
        trialCities: trialCitiesHelper(caseDetail.procedureType)
          .trialCitiesByState,
      };
      break;
    }
    case 'Nonstandard F': {
      fileDocumentData = {
        ordinalField: categoryInformation.ordinalField,
        previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
        previouslyFiledDocuments: getPreviouslyFiledDocuments(caseDetail),
        showNonstandardForm: true,
      };
      break;
    }
    case 'Nonstandard G': {
      fileDocumentData = {
        ordinalField: categoryInformation.ordinalField,
        showNonstandardForm: true,
      };
      break;
    }
    case 'Nonstandard H': {
      fileDocumentData = {
        showNonstandardForm: true,
        showSecondaryDocumentSelect: true,
      };
      break;
    }
  }

  return fileDocumentData;
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

export const fileDocumentHelper = get => {
  const caseDetail = get(state.caseDetail);
  const trialCitiesHelper = get(state.trialCitiesHelper);

  let fileDocumentData = {};

  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const selectedDocumentCategory = get(state.form.category);
  const selectedDocumentType = get(state.form.documentType);
  const categoryInformation = CATEGORY_MAP[selectedDocumentCategory].find(
    documentType => documentType.documentTitle === selectedDocumentType,
  );

  fileDocumentData.primary = getFileDocumentDataForCategory(
    caseDetail,
    trialCitiesHelper,
    categoryInformation,
  );

  const selectedSecondaryDocumentCategory = get(state.form.secondaryCategory);
  if (selectedSecondaryDocumentCategory) {
    const selectedSecondaryDocumentType = get(state.form.secondaryDocumentType);
    if (selectedSecondaryDocumentType) {
      const secondaryCategoryInformation = CATEGORY_MAP[
        selectedSecondaryDocumentCategory
      ].find(
        documentType =>
          documentType.documentTitle === selectedSecondaryDocumentType,
      );

      fileDocumentData.secondary = getFileDocumentDataForCategory(
        caseDetail,
        trialCitiesHelper,
        secondaryCategoryInformation,
      );
    }
  }

  return fileDocumentData;
};
