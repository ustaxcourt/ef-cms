import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { TDynamoRecord } from '../dynamoTypes';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesMetadataByLeadDocketNumber } from './getCasesMetadataByLeadDocketNumber';

describe('getCasesMetadataByLeadDocketNumber', () => {
  const mockLeadCase: TDynamoRecord = {
    docketNumber: '101-20',
    irsPractitioners: [],
    leadDocketNumber: '101-20',
    pk: 'case|101-20',
    privatePractitioners: [],
    sk: 'case|101-20',
    status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
  };
  const mockMemberCase: TDynamoRecord = {
    docketNumber: '102-20',
    irsPractitioners: [],
    leadDocketNumber: '101-20',
    pk: 'case|102-20',
    privatePractitioners: [],
    sk: 'case|102-20',
    status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
  };

  it('should retrieve each case record along with any associated counsel records in the consolidated group', async () => {
    applicationContext.getDocumentClient().query.mockReturnValueOnce({
      promise: () =>
        Promise.resolve({
          Items: [mockLeadCase, mockMemberCase],
        }),
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseMetadataWithCounsel.mockResolvedValueOnce(mockLeadCase)
      .mockResolvedValueOnce(mockMemberCase);

    const result = await getCasesMetadataByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: mockLeadCase.docketNumber,
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel,
    ).toHaveBeenCalledTimes(2);
    expect(result).toEqual([mockLeadCase, mockMemberCase]);
  });
});
