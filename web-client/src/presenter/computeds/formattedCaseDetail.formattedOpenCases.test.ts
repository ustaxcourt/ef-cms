import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedOpenCases as formattedOpenCasesComputed } from './formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import {
  simpleDocketEntries,
  mockPetitioners,
} from '@web-client/presenter/computeds/mockFormattedCaseDetailTestFixtures';

describe('formattedOpenCases', () => {
  const formattedOpenCases = withAppContextDecorator(
    formattedOpenCasesComputed,
    applicationContext,
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
