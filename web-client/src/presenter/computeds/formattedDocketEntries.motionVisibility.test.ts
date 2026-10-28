import { ROLES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import { privatePractitionerUser } from '@shared/test/mockUsers';
import { getFormattedDocketEntry } from './formattedDocketEntries';
import { runCompute } from 'cerebral/test';
import { type Get } from 'cerebral';
import { type FormattedDocketEntry } from '@shared/business/utilities/getFormattedCaseDetail';

let mockIsNotServedDocument;
jest.mock('@shared/business/utilities/getFormattedCaseDetail', () => ({
  computeIsNotServedDocument: jest
    .fn()
    .mockImplementation(() => mockIsNotServedDocument),
}));
import { DocketEntry } from '@shared/business/entities/DocketEntry';

import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import {
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;
const isDownloadableMock = jest
  .spyOn(DocketEntry, 'isDownloadable')
  .mockImplementation(() => true);
const motionVisibilityChangeDate = createISODateString();

describe('getFormattedDocketEntry', () => {
  let simpleDocketEntry;
  let mockCase;
  let baseParams;

  beforeEach(() => {
    mockIsNotServedDocument = false;
    mockCase = cloneDeep(MOCK_CASE);
    baseParams = {
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      entry: simpleDocketEntry,
      formattedCase: {
        ...MOCK_CASE,
        filedByRole: ROLES.privatePractitioner,
      },
      permissions: {},
      rawCase: mockCase,
      user: privatePractitionerUser,
      visibilityPolicyDateFormatted: '',
      motionVisibilityPolicyDateFormatted: motionVisibilityChangeDate,
    };
    simpleDocketEntry = new DocketEntry(
      {
        filingDate: calculateISODate({
          dateString: motionVisibilityChangeDate,
          howMuch: 1,
          units: 'years',
        }),
      },
      { authorizedUser: undefined },
    );
  });

  describe('motion visibility policy date formatted', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getFeatureFlagValues.mockResolvedValue([
        {
          name: 'motion-visibility-policy-change-date',
          value: {
            current: motionVisibilityChangeDate,
          },
        },
      ]);
    });

    it('should correctly format the motion visibility policy date', () => {
      runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(
        isDownloadableMock.mock.calls[0][1].motionVisibilityChangeDate,
      ).toBe(motionVisibilityChangeDate);
    });
  });
});
