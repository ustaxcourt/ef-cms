import { state } from 'cerebral';

export const fileDocumentHelper = get => {
  const caseDetail = get(state.caseDetail);
  const trialCitiesHelper = get(state.trialCitiesHelper);
  const previouslyFiledDocuments = caseDetail.documents.map(document => {
    return document.documentType;
  });

  const selectedDocumentCategory = get(state.form.category);
  const selectedDocumentType = get(state.form.documentType);

  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const categoryInformation = CATEGORY_MAP[selectedDocumentCategory].find(
    documentType => documentType.documentTitle === selectedDocumentType,
  );

  const showDateFields = categoryInformation.scenario === 'Nonstandard D';
  const textInputLabel = categoryInformation.labelFreeText;
  const showTrialLocationSelect =
    categoryInformation.scenario === 'Nonstandard E';

  const showTextInput =
    !showDateFields && !showTrialLocationSelect && textInputLabel;

  return {
    ordinalField: categoryInformation.ordinalField,
    previousDocumentSelectLabel: categoryInformation.labelPreviousDocument,
    previouslyFiledDocuments,
    showDateFields,
    showNonstandardForm: categoryInformation.scenario !== 'Standard',
    showSecondaryDocumentSelect:
      categoryInformation.scenario === 'Nonstandard H',
    showTextInput,
    showTrialLocationSelect,
    textInputLabel,
    trialCities: trialCitiesHelper(caseDetail.procedureType).trialCitiesByState,
  };
};
