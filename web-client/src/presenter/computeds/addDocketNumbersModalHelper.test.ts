import { addDocketNumbersModalHelper } from './addDocketNumbersModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('addDocketNumbersModalHelper', () => {
  it('should display the proper modal text when addedDocketNumbers is defined with only 1 docket number', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        addedDocketNumbers: ['101-20'],
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Save',
      modalTitle: 'Edit Docket Numbers',
    });
  });

  it('should display the proper modal text when addedDocketNumbers is defined with multiple docket number', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        addedDocketNumbers: ['101-20'],
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Save',
      modalTitle: 'Edit Docket Numbers',
    });
  });

  it('should display the proper modal text when addedDocketNumbers is undefined', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        addedDocketNumbers: undefined,
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Add Docket Numbers',
      modalTitle: 'Add Docket Numbers',
    });
  });
});
