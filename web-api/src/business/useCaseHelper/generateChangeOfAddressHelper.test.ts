import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/persistence/postgres/jobs/changeOfAddress/deleteChangeOfAddressCaseRecord',
);
jest.mock('@web-api/persistence/postgres/users/upsertUsers');

import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { generateChangeOfAddressHelper } from './generateChangeOfAddressHelper';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { deleteChangeOfAddressCaseRecord as deleteChangeOfAddressCaseRecordMock } from '@web-api/persistence/postgres/jobs/changeOfAddress/deleteChangeOfAddressCaseRecord';

describe('generateChangeOfAddressHelper', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const deleteChangeOfAddressCaseRecord = jest.mocked(
    deleteChangeOfAddressCaseRecordMock,
  );

  const mockPractitioner = MOCK_PRACTITIONER;

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      privatePractitioners: [mockPractitioner],
      irsPractitioners: [],
    });
    updateCaseAndAssociations.mockResolvedValue({} as any);
    applicationContext
      .getPersistenceGateway()
      .setChangeOfAddressCaseAsDone.mockResolvedValue([{ remaining: 1 }]);
    deleteChangeOfAddressCaseRecord.mockResolvedValue(undefined);
  });

  it('should log an error and continue if practitioner is not found on the case', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      privatePractitioners: [],
      irsPractitioners: [],
    });

    await generateChangeOfAddressHelper({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      bypassDocketEntry: true,
      contactInfo: mockPractitioner.contact as any,
      docketNumber: MOCK_CASE.docketNumber,
      jobId: 'job-123',
      oldUser: mockPractitioner as any,
      user: mockPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalled();
  });

  it('should process address change when practitioner is found and job is not done', async () => {
    await generateChangeOfAddressHelper({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      bypassDocketEntry: true,
      contactInfo: mockPractitioner.contact as any,
      docketNumber: MOCK_CASE.docketNumber,
      jobId: 'job-123',
      oldUser: mockPractitioner as any,
      user: mockPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(deleteChangeOfAddressCaseRecord).not.toHaveBeenCalled();
  });

  it('should delete the job and send completion notification when job is done processing', async () => {
    applicationContext
      .getPersistenceGateway()
      .setChangeOfAddressCaseAsDone.mockResolvedValue([{ remaining: 0 }]);

    await generateChangeOfAddressHelper({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      bypassDocketEntry: true,
      contactInfo: mockPractitioner.contact as any,
      docketNumber: MOCK_CASE.docketNumber,
      jobId: 'job-123',
      oldUser: mockPractitioner as any,
      user: mockPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(deleteChangeOfAddressCaseRecord).toHaveBeenCalledWith('job-123');
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(2);
  });

  it('should send admin notification when websocketMessagePrefix is admin', async () => {
    applicationContext
      .getPersistenceGateway()
      .setChangeOfAddressCaseAsDone.mockResolvedValue([{ remaining: 0 }]);

    await generateChangeOfAddressHelper({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      bypassDocketEntry: true,
      contactInfo: mockPractitioner.contact as any,
      docketNumber: MOCK_CASE.docketNumber,
      jobId: 'job-123',
      oldUser: mockPractitioner as any,
      requestUserId: 'admin-user-id',
      user: mockPractitioner as any,
      websocketMessagePrefix: 'admin',
    });

    const progressCall =
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0];
    expect(progressCall.message.action).toBe(
      'admin_contact_update_progress',
    );
    expect(progressCall.userId).toBe('admin-user-id');
  });

  it('should update service indicator to electronic when updatedEmail is provided', async () => {
    await generateChangeOfAddressHelper({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      bypassDocketEntry: true,
      contactInfo: mockPractitioner.contact as any,
      docketNumber: MOCK_CASE.docketNumber,
      jobId: 'job-123',
      oldUser: mockPractitioner as any,
      updatedEmail: 'newemail@example.com',
      user: mockPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(updateCaseAndAssociations).toHaveBeenCalled();
  });
});
