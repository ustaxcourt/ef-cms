import { state } from 'cerebral';

const getFileDocumentDataForCategory = (caseDetail, categoryInformation) => {
  let fileDocumentData = {};

  switch (categoryInformation.scenario) {
    case 'Standard': {
      fileDocumentData.showNonstandardForm = false;
      break;
    }
    case 'Nonstandard A': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.previousDocumentSelectLabel =
        categoryInformation.labelPreviousDocument;
      fileDocumentData.previouslyFiledDocuments = getPreviouslyFiledDocuments(
        caseDetail,
      );
      break;
    }
    case 'Nonstandard B': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.textInputLabel = categoryInformation.labelFreeText;
      break;
    }
    case 'Nonstandard C': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.previousDocumentSelectLabel =
        categoryInformation.labelPreviousDocument;
      fileDocumentData.previouslyFiledDocuments = getPreviouslyFiledDocuments(
        caseDetail,
      );
      fileDocumentData.textInputLabel = categoryInformation.labelFreeText;
      break;
    }
    case 'Nonstandard D': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.previousDocumentSelectLabel =
        categoryInformation.labelPreviousDocument;
      fileDocumentData.previouslyFiledDocuments = getPreviouslyFiledDocuments(
        caseDetail,
      );
      fileDocumentData.textInputLabel = categoryInformation.labelFreeText;
      break;
    }
    case 'Nonstandard E': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.showTrialLocationSelect = true;
      break;
    }
    case 'Nonstandard F': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.ordinalField = categoryInformation.ordinalField;
      fileDocumentData.previouslyFiledDocuments = getPreviouslyFiledDocuments(
        caseDetail,
      );
      break;
    }
    case 'Nonstandard G': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.ordinalField = categoryInformation.ordinalField;
      break;
    }
    case 'Nonstandard H': {
      fileDocumentData.showNonstandardForm = true;
      fileDocumentData.showSecondaryDocumentSelect = true;
      break;
    }
  }

  return fileDocumentData;
};

const getPreviouslyFiledDocuments = get => {
  const caseDetail = get(state.caseDetail);
  return caseDetail.documents.map(document => {
    return document.documentType;
  });
};

export const fileDocumentHelper = get => {
  const caseDetail = get(state.caseDetail);

  let fileDocumentData = {};

  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const selectedDocumentCategory = get(state.form.category);
  const selectedDocumentType = get(state.form.documentType);
  const categoryInformation = CATEGORY_MAP[selectedDocumentCategory].find(
    documentType => documentType.documentTitle === selectedDocumentType,
  );

  fileDocumentData.primary = getFileDocumentDataForCategory(
    caseDetail,
    categoryInformation,
  );

  const selectedSecondaryDocumentCategory = get(state.form.secondaryCategory);
  if (selectedSecondaryDocumentCategory) {
    const selectedSecondaryDocumentType = get(state.form.documentType);
    if (selectedSecondaryDocumentType) {
      const secondaryCategoryInformation = CATEGORY_MAP[
        selectedDocumentCategory
      ].find(
        documentType =>
          documentType.documentTitle === selectedSecondaryDocumentType,
      );

      fileDocumentData.secondary = getFileDocumentDataForCategory(
        get,
        secondaryCategoryInformation,
      );
    }
  }

  return fileDocumentData;
};
