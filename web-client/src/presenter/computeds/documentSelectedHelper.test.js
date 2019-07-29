import { documentSelectedHelper } from './documentSelectedHelper';
import { runCompute } from 'cerebral/test';

describe('documentSelectedHelper', () => {
  it('defaults to Petition', () => {
    const result = runCompute(documentSelectedHelper, {
      state: {},
    });

    expect(result).toMatchObject({
      documentSelectedForScanName: 'Petition',
    });
  });

  it('translates requestForPlaceOfTrialFile', () => {
    const result = runCompute(documentSelectedHelper, {
      state: {
        documentSelectedForScan: 'requestForPlaceOfTrialFile',
      },
    });

    expect(result).toMatchObject({
      documentSelectedForScanName: 'Request of Place for Trial',
    });
  });

  it('translates stinFile', () => {
    const result = runCompute(documentSelectedHelper, {
      state: {
        documentSelectedForScan: 'stinFile',
      },
    });

    expect(result).toMatchObject({
      documentSelectedForScanName: 'Statement of Taxpayer Identification',
    });
  });

  it('translates ownershipDisclosureFile', () => {
    const result = runCompute(documentSelectedHelper, {
      state: {
        documentSelectedForScan: 'ownershipDisclosureFile',
      },
    });

    expect(result).toMatchObject({
      documentSelectedForScanName: 'Ownership Discloser Statement',
    });
  });
});
