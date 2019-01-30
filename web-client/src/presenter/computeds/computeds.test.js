import { runCompute } from 'cerebral/test';

import { formattedCaseDetail, formattedCases } from './formattedCaseDetail';

describe('formatted case details computed', () => {
  it('formats the date', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          irsDate: '2018-11-21T20:49:28.192Z',
          documents: [
            {
              documentType: 'Petition',
              createdAt: '2018-11-21T20:49:28.192Z',
              reviewDate: '2018-11-22T20:49:28.192Z',
              status: 'served',
            },
          ],
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
            irsDate: '2018-11-21T20:49:28.192Z',
            documents: [
              {
                documentType: 'fakeType',
                createdAt: '2018-11-21T20:49:28.192Z',
                reviewDate: '2018-11-22T20:49:28.192Z',
                status: 'served',
              },
            ],
          },
        ],
      },
    });
    expect(result[0].irsDateFormatted).toContain('11/21/2018');
  });

  it('formats the respondent name to include barnumber', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [{ respondent: { name: 'test', barNumber: '123' } }],
      },
    });
    expect(result[0].respondent.formattedName).toContain('test 123');
  });
});
