import '@web-api/persistence/postgres/cases/mocks.jest';
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
  getFeatureFlagValues.mockResolvedValue([
    {
      name: 'motion-visibility-policy-change-date',
      value: {
        current: motionVisibilityChangeDate,
      },
    },
  ]);

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
    mockCase = cloneDeep(MOCK_CASE);
    mockCase.docketEntries = [...mockCase.docketEntries, docketEntry];
    jest.clearAllMocks();

    getCaseByDocketNumber.mockResolvedValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue('localhost');
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
