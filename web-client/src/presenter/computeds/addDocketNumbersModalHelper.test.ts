import { addDocketNumbersModalHelper } from './addDocketNumbersModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('addDocketNumbersModalHelper', () => {
  it('should display the "Edit Docket Numbers" as modal title and "Save" as confirm label title if setSelectedConsolidatedCasesToMultiDocketOn is true', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        setSelectedConsolidatedCasesToMultiDocketOn: true,
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Save',
      modalTitle: 'Edit Docket Numbers',
    });
  });

  it('should display the "Add Docket Numbers" for modal title and label title if setSelectedConsolidatedCasesToMultiDocketOn is false', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        setSelectedConsolidatedCasesToMultiDocketOn: false,
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Add Docket Numbers',
      modalTitle: 'Add Docket Numbers',
    });
  });
});
