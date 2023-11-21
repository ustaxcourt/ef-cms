import { addDocketNumbersModalHelper } from './addDocketNumbersModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('addDocketNumbersModalHelper', () => {
  it('should display the "Edit Docket Numbers" modalTitle and "Save" label title if proper modal text if processConsolidatedCasesSelection is true', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        processConsolidatedCasesSelection: true,
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Save',
      modalTitle: 'Edit Docket Numbers',
    });
  });

  it('should display the "Add Docket Numbers" modalTitle and confirmLabelTitle if processConsolidatedCasesSelection is false', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        processConsolidatedCasesSelection: false,
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Add Docket Numbers',
      modalTitle: 'Add Docket Numbers',
    });
  });
});
