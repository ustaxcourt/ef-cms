import { addDocketNumbersModalHelper } from './addDocketNumbersModalHelper';
import { runCompute } from 'cerebral/test';

describe('addDocketNumbersModalHelper', () => {
  it('should display the proper modal text when addedDocketNumbers is defined with only 1 docket number', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        addedDocketNumbers: ['101-20'],
        caseDetail: {
          consolidatedCases: [
            {
              checked: true,
              docketNumber: '101-20',
              leadDocketNumber: '101-20',
            },
          ],
        },
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Save',
      modalText: '"ET AL." will not be appended to the caption.',
      modalTitle: 'Edit Docket Numbers',
    });
  });

  it('should display the proper modal text when addedDocketNumbers is defined with multiple docket number', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        addedDocketNumbers: ['101-20'],
        caseDetail: {
          consolidatedCases: [
            {
              checked: true,
              docketNumber: '101-20',
            },
            {
              checked: true,
              docketNumber: '102-20',
            },
          ],
        },
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Save',
      modalText:
        'Petitioner\'s name will be automatically appended with "ET AL.".',
      modalTitle: 'Edit Docket Numbers',
    });
  });

  it('should display the proper modal text when addedDocketNumbers is undefined', () => {
    const result = runCompute(addDocketNumbersModalHelper, {
      state: {
        addedDocketNumbers: undefined,
        caseDetail: {
          consolidatedCases: [
            {
              checked: false,
              docketNumber: '101-20',
            },
            {
              checked: false,
              docketNumber: '102-20',
            },
          ],
        },
      },
    });
    expect(result).toMatchObject({
      confirmLabelTitle: 'Add Docket Numbers',
      modalText: '"ET AL." will not be appended to the caption.',
      modalTitle: 'Add Docket Numbers',
    });
  });
});
