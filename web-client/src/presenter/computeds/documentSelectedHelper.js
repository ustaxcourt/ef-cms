import { state } from 'cerebral';

export const documentSelectedHelper = get => {
  const documentSelectedForScan = get(state.documentSelectedForScan);

  let documentSelectedForScanName;

  switch (documentSelectedForScan) {
    default:
      documentSelectedForScanName = 'Petition';
      break;
    case 'requestForPlaceOfTrialFile':
      documentSelectedForScanName = 'Request of Place for Trial';
      break;
    case 'stinFile':
      documentSelectedForScanName = 'Statement of Taxpayer Identification';
      break;
    case 'ownershipDisclosureFile':
      documentSelectedForScanName = 'Ownership Discloser Statement';
      break;
  }

  return {
    documentSelectedForScanName,
  };
};
