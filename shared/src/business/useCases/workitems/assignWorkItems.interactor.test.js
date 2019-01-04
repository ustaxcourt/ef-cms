const { assignWorkItems } = require('./assignWorkItems.interactor');
const _ = require('lodash');

const MOCK_WORK_ITEM = {
  createdAt: '2018-12-27T18:06:02.971Z',
  assigneeName: 'bob',
  caseStatus: 'general',
  caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
  document: {
    documentType: 'Stipulated Decision',
    createdAt: '2018-12-27T18:06:02.968Z',
    documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
  },
  messages: [
    {
      createdAt: '2018-12-27T18:06:02.968Z',
      messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
      message: 'a Stipulated Decision filed by respondent is ready for review',
      userId: 'respondent',
      sentBy: 'Test Respondent',
      sentTo: null,
    },
  ],
  section: 'docket',
  workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  assigneeId: null,
  docketNumber: '101-18',
  sentBy: 'respondent',
  updatedAt: '2018-12-27T18:06:02.968Z',
};

describe('assignWorkItems', () => {
  it('unauthorized user tries to assign a work item', async () => {
    let error;
    try {
      await assignWorkItems({
        userId: 'baduser',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('fail on validation if the work items provided are invalid', async () => {
    const applicationContext = {
      user: {
        name: 'bob',
      },
      getPersistenceGateway: () => {
        return {
          getWorkItemById: async () => _.omit(MOCK_WORK_ITEM, 'caseId'),
          saveWorkItem: async () => ({
            abc: 123,
          }),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await assignWorkItems({
        userId: 'docketclerk',
        workItems: [{}],
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('be successful when all validation passed', async () => {
    const applicationContext = {
      user: {
        name: 'bob',
      },
      getPersistenceGateway: () => {
        return {
          getWorkItemById: async () => MOCK_WORK_ITEM,
          saveWorkItem: async () => ({
            abc: 123,
          }),
        };
      },
      environment: { stage: 'local' },
    };
    await assignWorkItems({
      userId: 'docketclerk',
      workItems: [MOCK_WORK_ITEM],
      applicationContext,
    });
  });
});
