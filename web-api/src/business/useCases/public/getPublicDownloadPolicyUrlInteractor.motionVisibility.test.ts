import '@web-api/persistence/postgres/cases/mocks.jest';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { getPublicDownloadPolicyUrlInteractor } from './getPublicDownloadPolicyUrlInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';

import { cloneDeep } from 'lodash';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;

describe('getPublicDownloadPolicyUrlInteractor motion visibility', () => {
  let mockCase;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const motionVisibilityChangeDate = createISODateString();

  const isDownloadableMock = jest
    .spyOn(DocketEntry, 'isDownloadable')
    .mockImplementation(() => true);

  const docketEntry = new DocketEntry(
    {
      isFileAttached: true,
    },
    { authorizedUser: undefined },
  );

  beforeEach(() => {
    getFeatureFlagValues.mockResolvedValue([
      {
        name: 'motion-visibility-policy-change-date',
        value: {
          current: motionVisibilityChangeDate,
        },
      },
    ]);

    mockCase = cloneDeep(MOCK_CASE);
    mockCase.docketEntries = [...mockCase.docketEntries, docketEntry];
    jest.clearAllMocks();

    getCaseByDocketNumber.mockResolvedValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'https://example.com' });
  });

  it('should pass the correct motion visibility change date to the docket entry', async () => {
    await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        isTerminalUser: false,
        key: docketEntry.docketEntryId,
      },
      mockDocketClerkUser,
    );

    expect(isDownloadableMock.mock.calls[0][0]).toMatchObject({
      docketEntryId: docketEntry.docketEntryId,
    });
    expect(isDownloadableMock.mock.calls[0][1]).toMatchObject({
      isTerminalUser: false,
      visibilityChangeDate: false,
      motionVisibilityChangeDate,
    });
  });
});

describe('getPublicDownloadPolicyUrlInteractor lodged practitioner motion', () => {
  let mockCase;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const motionVisibilityChangeDate = createISODateString(
    '2027-01-01',
    'yyyy-MM-dd',
  );
  const afterMotionVisibilityChangeDate = createISODateString(
    '2027-02-01',
    'yyyy-MM-dd',
  );

  const lodgedMotionEntry = new DocketEntry(
    {
      documentTitle: 'Motion to Dismiss',
      documentType: 'Motion',
      eventCode: 'M006',
      filedByRole: ROLES.privatePractitioner,
      filingDate: afterMotionVisibilityChangeDate,
      isFileAttached: true,
      isOnDocketRecord: true,
      isPaper: false,
      lodged: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      servedAt: afterMotionVisibilityChangeDate,
    },
    { authorizedUser: undefined },
  );

  beforeEach(() => {
    jest.spyOn(DocketEntry, 'isDownloadable').mockRestore();

    getFeatureFlagValues.mockResolvedValue([
      {
        name: 'motion-visibility-policy-change-date',
        value: {
          current: motionVisibilityChangeDate,
        },
      },
    ]);

    mockCase = cloneDeep(MOCK_CASE);
    mockCase.docketEntries = [...mockCase.docketEntries, lodgedMotionEntry];

    getCaseByDocketNumber.mockResolvedValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockResolvedValue({ url: 'https://example.com' });
  });

  afterAll(() => {
    jest.spyOn(DocketEntry, 'isDownloadable').mockImplementation(() => true);
  });

  it('returns a download URL for terminal users when the motion is lodged', async () => {
    const result = await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
        isTerminalUser: true,
        key: lodgedMotionEntry.docketEntryId,
      },
      mockDocketClerkUser,
    );

    expect(result.url).toEqual('https://example.com');
  });

  it('throws when a non-terminal public user requests a lodged practitioner motion', async () => {
    await expect(
      getPublicDownloadPolicyUrlInteractor(
        applicationContext,
        {
          docketNumber: mockCase.docketNumber,
          isTerminalUser: false,
          key: lodgedMotionEntry.docketEntryId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized to access private document');
  });
});
