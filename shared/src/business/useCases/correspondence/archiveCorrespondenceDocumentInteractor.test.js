const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  archiveCorrespondenceDocumentInteractor,
} = require('./archiveCorrespondenceDocumentInteractor');
const { Correspondence } = require('../../entities/Correspondence');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('archiveCorrespondenceDocumentInteractor', () => {
  let mockUser;
  let mockUserId = '2474e5c0-f741-4120-befa-b77378ac8bf0';
  const mockCorrespondenceId = applicationContext.getUniqueId();
  const mockCorrespondence = new Correspondence({
    correspondenceId: mockCorrespondenceId,
    documentTitle: 'My Correspondence',
    filedBy: 'Docket clerk',
    userId: mockUserId,
  });

  beforeEach(() => {
    mockUser = {
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: mockUserId,
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        correspondence: [mockCorrespondence],
      });
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    const user = { ...mockUser, role: ROLES.petitioner };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      archiveCorrespondenceDocumentInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('should delete the specified correspondence document from s3', async () => {
    await archiveCorrespondenceDocumentInteractor(applicationContext, {
      correspondenceId: mockCorrespondenceId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3.mock
        .calls[0][0],
    ).toMatchObject({
      key: mockCorrespondenceId,
    });
  });

  it('should update the specified correspondence document on the case to be marked as archived', async () => {
    await archiveCorrespondenceDocumentInteractor(applicationContext, {
      correspondenceId: mockCorrespondenceId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      correspondence: mockCorrespondence,
      docketNumber: MOCK_CASE.docketNumber,
    });
  });

  it('should update the case to reflect the archived correspondence', async () => {
    await archiveCorrespondenceDocumentInteractor(applicationContext, {
      correspondenceId: mockCorrespondenceId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.correspondence,
    ).toEqual([]);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.archivedCorrespondences,
    ).toEqual([{ ...mockCorrespondence, archived: true }]);
  });
});
