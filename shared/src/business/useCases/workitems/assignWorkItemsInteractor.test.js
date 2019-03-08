const { assignWorkItems } = require('./assignWorkItemsInteractor');
const _ = require('lodash');
const User = require('../../entities/User');

const MOCK_WORK_ITEM = {
  assigneeId: null,
  assigneeName: 'bob',
  caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
  caseStatus: 'General',
  createdAt: '2018-12-27T18:06:02.971Z',
  docketNumber: '101-18',
  docketNumberSuffix: 'S',
  document: {
    createdAt: '2018-12-27T18:06:02.968Z',
    documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
    documentType: 'Stipulated Decision',
  },
  messages: [
    {
      createdAt: '2018-12-27T18:06:02.968Z',
      from: 'Test Respondent',
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'a Stipulated Decision filed by respondent is ready for review',
      messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
      to: null,
      userId: 'respondent',
    },
  ],
  section: 'docket',
  sentBy: 'respondent',
  updatedAt: '2018-12-27T18:06:02.968Z',
  workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
};

describe('assignWorkItems', () => {
  it('unauthorized user tries to assign a work item', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'baduser',
      }),
    };
    let error;
    try {
      await assignWorkItems({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('fail on validation if the work items provided are invalid', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getPersistenceGateway: () => {
        return {
          getWorkItemById: async () => _.omit(MOCK_WORK_ITEM, 'caseId'),
          saveWorkItem: async () => ({
            abc: 123,
          }),
        };
      },
      user: {
        name: 'bob',
        role: 'petitionsclerk',
      },
    };
    let error;
    try {
      await assignWorkItems({
        applicationContext,
        userId: 'docketclerk',
        workItems: [{}],
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('be successful when all validation passed', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Test Docketclerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getWorkItemById: async () => MOCK_WORK_ITEM,
          saveWorkItem: async () => ({
            abc: 123,
          }),
        };
      },
    };
    await assignWorkItems({
      applicationContext,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [MOCK_WORK_ITEM],
    });
  });
});
