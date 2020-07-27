const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { createWorkItemInteractor } = require('./createWorkItemInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { ROLES } = require('../../entities/EntityConstants');

describe('createWorkItem', () => {
  let createWorkItemStub;
  let updateCaseStub;

  beforeEach(() => {
    createWorkItemStub = jest.fn().mockResolvedValue(null);
    updateCaseStub = jest.fn().mockResolvedValue(null);
  });

  const createApplicationContext = overrides => ({
    environment: { stage: 'local' },
    getCurrentUser: () => ({
      name: 'Tax Payer',
      role: ROLES.petitioner,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    }),
    getPersistenceGateway: () => ({
      createWorkItem: createWorkItemStub,
      getCaseByDocketNumber: () => MOCK_CASE,
      getUserById: ({ userId }) => MOCK_USERS[userId],
      updateCase: updateCaseStub,
    }),
    getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    ...overrides,
  });

  it('throws an error when an unauthorized user tries to invoke the createWorkItem interactor', async () => {
    const applicationContext = createApplicationContext();
    let error;
    try {
      await createWorkItemInteractor({
        applicationContext,
        assigneeId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        message: 'testing',
      });
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Unauthorized for create workItem');
  });

  it('attempts to invoke createWorkItem with the expected workItem', async () => {
    const applicationContext = createApplicationContext({
      getCurrentUser: () => ({
        name: 'Docketclerk',
        role: ROLES.docketClerk,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    });

    await createWorkItemInteractor({
      applicationContext,
      assigneeId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
      docketNumber: '101-18',
      documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      message: 'testing',
    });
    expect(createWorkItemStub.mock.calls.length).toEqual(1);
    expect(createWorkItemStub.mock.calls[0][0].workItem).toMatchObject({
      assigneeId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
      assigneeName: 'Docketclerk1',
      caseStatus: CASE_STATUS_TYPES.new,
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18',
      document: {
        documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Answer',
        documentType: 'Answer',
      },
      isInitializeCase: false,
      messages: [
        {
          from: 'Docketclerk',
          fromUserId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
          message: 'testing',
          to: 'Docketclerk1',
          toUserId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
      section: 'docket',
      sentBy: 'Docketclerk',
      sentByUserId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('attempts to invoke updateCase with the expected caseToUpdate argument', async () => {
    const applicationContext = createApplicationContext({
      getCurrentUser: () => ({
        name: 'Docketclerk',
        role: ROLES.docketClerk,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    });

    await createWorkItemInteractor({
      applicationContext,
      assigneeId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
      docketNumber: '101-18',
      documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      message: 'testing',
    });
    expect(updateCaseStub.mock.calls.length).toEqual(1);
    expect(
      updateCaseStub.mock.calls[0][0].caseToUpdate.documents[2].workItems[0],
    ).toMatchObject({
      assigneeId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
      assigneeName: 'Docketclerk1',
      caseStatus: CASE_STATUS_TYPES.new,
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18',
      document: {
        documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Answer',
        documentType: 'Answer',
      },
      isInitializeCase: false,
      messages: [
        {
          from: 'Docketclerk',
          fromUserId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
          message: 'testing',
          to: 'Docketclerk1',
          toUserId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
      section: 'docket',
      sentBy: 'Docketclerk',
      sentByUserId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });
});
