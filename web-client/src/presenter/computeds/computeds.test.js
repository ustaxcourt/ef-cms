import { runCompute } from 'cerebral/test';

import { CASE_CAPTION_POSTFIX } from '../../../../shared/src/business/entities/cases/Case';
import {
  formattedCaseDetail as formattedCaseDetailComputed,
  formattedCases as formattedCasesComputed,
} from './formattedCaseDetail';
import { withAppContextDecorator } from '../../withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);
const formattedCases = withAppContextDecorator(formattedCasesComputed);

describe('formatted case details computed', () => {
  it('formats the date', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          caseCaption: 'Brett Osborne, Petitioner',
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentType: 'Petition',
              reviewDate: '2018-11-22T20:49:28.192Z',
              status: 'served',
            },
          ],
          irsSendDate: '2018-11-21T20:49:28.192Z',
          petitioners: [{ name: 'bob' }],
        },
        constants: {
          CASE_CAPTION_POSTFIX,
        },
        form: {},
      },
    });
    expect(result.irsDateFormatted).toContain('11/21/18');
    expect(result.documents[0].isPetition).toEqual(true);
  });

  it('formats the date in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [
          {
            caseCaption: 'Brett Osborne, Petitioner',
            documents: [
              {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentType: 'fakeType',
                reviewDate: '2018-11-22T20:49:28.192Z',
                status: 'served',
              },
            ],
            irsSendDate: '2018-11-21T20:49:28.192Z',
            petitioners: [{ name: 'bob' }],
          },
        ],
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result[0].irsDateFormatted).toContain('11/21/18');
  });

  it('formats the respondent name to include barnumber', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [
          {
            caseCaption: 'Brett Osborne, Petitioner',
            petitioners: [{ name: 'bob' }],
            respondents: [{ barNumber: '123', name: 'test' }],
          },
        ],
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result[0].respondents[0].formattedName).toContain('test 123');
  });
});
