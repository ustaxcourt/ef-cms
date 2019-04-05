import { state } from 'cerebral';

export const fileDocumentHelper = get => {
  const caseDetail = get(state.caseDetail);
  const trialCitiesHelper = get(state.trialCitiesHelper);

  const selectedDocumentCategory = get(state.form.category);
  const selectedDocumentType = get(state.form.documentType);

  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const categoryInformation = CATEGORY_MAP[selectedDocumentCategory].find(
    documentType => documentType.documentTitle === selectedDocumentType,
  );

  let previouslyFiledDocuments = [];
  if (categoryInformation.labelPreviousDocument) {
    previouslyFiledDocuments = caseDetail.documents
      .filter(
        document =>
          document.documentType !== 'Statement of Taxpayer Identification',
      )
      .map(document => {
        return document.documentType;
      });
  }

  const showDateFields = categoryInformation.scenario === 'Nonstandard D';
  const textInputLabel = categoryInformation.labelFreeText;
  const showTrialLocationSelect =
    categoryInformation.scenario === 'Nonstandard E';

  const showTextInput =
    !showDateFields && !showTrialLocationSelect && textInputLabel !== '';

  let trialCities = {};

  if (showTrialLocationSelect) {
    trialCities = trialCitiesHelper(caseDetail.procedureType)
      .trialCitiesByState;
  }

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
    trialCities,
  };
};
