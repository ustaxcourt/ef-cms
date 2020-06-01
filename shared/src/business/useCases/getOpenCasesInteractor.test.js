const { applicationContext } = require('../test/createTestApplicationContext');
const { getOpenCasesInteractor } = require('./getOpenCasesInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('getOpenCasesInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(
        MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
      );

    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  it('should retrieve the current user information', async () => {
    await getOpenCasesInteractor({
      applicationContext,
    });

    expect(applicationContext.getCurrentUser).toBeCalled();
  });

  it('should make a call to retrieve open cases by user', async () => {
    await getOpenCasesInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getOpenCasesByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should add document contents to all case documents when open cases are found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getOpenCasesByUser.mockResolvedValue([
        {
          ...MOCK_CASE,
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              documentContentsId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
              documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentTitle: 'Petition',
              documentType: 'Petition',
              draftState: {},
              eventCode: 'P',
              processingStatus: 'pending',
              userId: '273f5d19-3707-41c0-bccc-449c52dfe54e',
              workItems: [],
            },
          ],
        },
      ]);

    const result = await getOpenCasesInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      documentId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
      protocol: 'S3',
      useTempBucket: false,
    });
    expect(result[0].documents[0]).toMatchObject({
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentContentsId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentTitle: 'Petition',
      documentType: 'Petition',
      draftState: {},
      entityName: 'Document',
      eventCode: 'P',
      userId: '273f5d19-3707-41c0-bccc-449c52dfe54e',
      workItems: [],
    });
  });

  it('should return an empty ist when no open cases are found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getOpenCasesByUser.mockResolvedValue(null);

    const result = await getOpenCasesInteractor({
      applicationContext,
    });

    expect(result).toEqual([]);
  });

  it('should return a list of open cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getOpenCasesByUser.mockResolvedValue([MOCK_CASE]);

    const result = await getOpenCasesInteractor({
      applicationContext,
    });

    expect(result).toMatchObject([MOCK_CASE]);
  });
});
