import { runCompute } from 'cerebral/test';

import { formattedCaseDetail, formattedCases } from './formattedCaseDetail';
import { CASE_CAPTION_POSTFIX } from '../../../../shared/src/business/entities/Case';

describe('formatted case details computed', () => {
  it('formats the date', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentType: 'Petition',
              reviewDate: '2018-11-22T20:49:28.192Z',
              status: 'served',
            },
          ],
          irsDate: '2018-11-21T20:49:28.192Z',
          petitioners: [{ name: 'bob' }],
        },
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {},
      },
    });
    expect(result.irsDateFormatted).toContain('11/21/2018');
    expect(result.documents[0].isPetition).toEqual(true);
  });

  it('formats the date in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [
          {
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentType: 'fakeType',
                reviewDate: '2018-11-22T20:49:28.192Z',
                status: 'served',
              },
            ],
            irsDate: '2018-11-21T20:49:28.192Z',
            petitioners: [{ name: 'bob' }],
          },
        ],
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result[0].irsDateFormatted).toContain('11/21/2018');
  });

  it('formats the respondent name to include barnumber', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [
          {
            petitioners: [{ name: 'bob' }],
            respondent: { barNumber: '123', name: 'test' },
          },
        ],
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result[0].respondent.formattedName).toContain('test 123');
  });
});
