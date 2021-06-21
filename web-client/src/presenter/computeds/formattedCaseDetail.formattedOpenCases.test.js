import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedOpenCases as formattedOpenCasesComputed } from './formattedCaseDetail';
import {
  mockPetitioners,
  simpleDocketEntries,
} from './formattedCaseDetail.test';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedOpenCases', () => {
  const formattedOpenCases = withAppContextDecorator(
    formattedOpenCasesComputed,
    {
      ...applicationContext,
      getCurrentUser: () => ({
        role: ROLES.petitionsClerk,
        userId: '111',
      }),
    },
  );

  it('should return formatted open cases', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
      createdAt: '2020-02-02T17:29:13.120Z',
      docketEntries: simpleDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: mockPetitioners,
    };

    const result = runCompute(formattedOpenCases, {
      state: {
        openCases: [caseDetail],
      },
    });

    expect(result).toMatchObject([{ createdAtFormatted: '02/02/20' }]);
  });
});
