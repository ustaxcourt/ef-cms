import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_USERS } from '../../../../shared/src/test/mockUsers';
import { applicationContext } from '../../applicationContext';
import { formattedCases as formattedCasesComputed } from './formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

applicationContext.getCurrentUser = () =>
  MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'];

const formattedCases = withAppContextDecorator(
  formattedCasesComputed,
  applicationContext,
);

describe('formatted case details computed', () => {
  it('formats the date in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [
          {
            caseCaption: 'Brett Osborne, Petitioner',
            docketRecord: [],
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentType: 'fakeType',
                status: 'served',
              },
            ],
            irsSendDate: '2018-11-21T20:49:28.192Z',
            petitioners: [{ name: 'bob' }],
          },
        ],
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result[0].irsDateFormatted).toContain('11/21/18');
  });

  it('formats the respondent name to include barNumber', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [
          {
            caseCaption: 'Brett Osborne, Petitioner',
            irsPractitioners: [{ barNumber: '123', name: 'test' }],
            petitioners: [{ name: 'bob' }],
          },
        ],
        constants: {
          CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result[0].irsPractitioners[0].formattedName).toContain('test (123)');
  });
});
