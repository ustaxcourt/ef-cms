import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedClosedCases as formattedClosedCasesComputed } from './formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import {
  mockPetitioners,
  simpleDocketEntries,
} from '@web-client/presenter/computeds/mockFormattedCaseDetailTestFixtures';

describe('formattedClosedCases', () => {
  const formattedClosedCases = withAppContextDecorator(
    formattedClosedCasesComputed,
    applicationContext,
  );

  it('should return formatted closed cases', () => {
    const caseDetail = {
      caseCaption: 'Brett Osborne, Petitioner',
      correspondence: [],
      createdAt: '2020-02-02T17:29:13.120Z',
      docketEntries: simpleDocketEntries,
      hasVerifiedIrsNotice: false,
      petitioners: mockPetitioners,
    };

    const result = runCompute(formattedClosedCases, {
      state: {
        closedCases: [caseDetail],
      },
    });

    expect(result).toMatchObject([{ createdAtFormatted: '02/02/20' }]);
  });
});
