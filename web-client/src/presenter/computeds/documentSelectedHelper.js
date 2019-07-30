import { state } from 'cerebral';

export const documentSelectedHelper = get => {
  const documentSelectedForScanName = getDocumentSelectedScanName(
    get(state.documentSelectedForScan),
  );
  const documentSelectedForPreview =
    documentSelectedForScanName == get(state.documentSelectedForPreview);

  return {
    documentSelectedForPreview,
    documentSelectedForScanName,
  };
};

const getDocumentSelectedScanName = documentSelectedForScan => {
  let documentSelectedForScanName;

  switch (documentSelectedForScan) {
    case 'requestForPlaceOfTrialFile':
      documentSelectedForScanName = 'Request of Place for Trial';
      break;
    case 'stinFile':
      documentSelectedForScanName = 'Statement of Taxpayer Identification';
      break;
    case 'ownershipDisclosureFile':
      documentSelectedForScanName = 'Ownership Discloser Statement';
      break;
    default:
      documentSelectedForScanName = 'Petition';
      break;
  }
  return documentSelectedForScanName;
};
