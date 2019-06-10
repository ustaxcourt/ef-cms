const { Message } = require('./Message');
const { WorkItem } = require('./WorkItem');

describe('WorkItem', () => {
  describe('isValid', () => {
    it('Creates a valid workitem', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        messages: [],
        section: 'docket',
        sentBy: 'bob',
      });
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a workItemId', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        messages: [],
        section: 'docket',
        sentBy: 'bob',
        workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a isRead', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        isRead: true,
        messages: [],
        section: 'docket',
        sentBy: 'bob',
        workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Create a valid workitem without messages', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        section: 'docket',
        sentBy: 'bob',
      });
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Create a valid workitem with real message', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        messages: [
          {
            from: 'abc',
            fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'abc',
          },
        ],
        section: 'docket',
        sentBy: 'bob',
      });
      expect(workItem.isValid()).toBeTruthy();
    });
  });

  describe('acquires messages', () => {
    it('when calling add message', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        messages: [],
        sentBy: 'bob',
      });
      workItem.addMessage(
        new Message({
          from: 'abc',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'abc',
        }),
      );
      expect(workItem.messages.length).toEqual(1);
    });

    it('no message added when set as completed', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        messages: [],
        sentBy: 'bob',
      });
      workItem.setAsCompleted({
        user: { name: 'jane', userId: '6805d1ab-18d0-43ec-bafb-654e83405416' },
      });
      expect(workItem.messages.length === 0).toBe(true);
    });

    it('a message should be added when set as sentToIRS', () => {
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'Batched for IRS',
        caseTitle: 'testing',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        messages: [],
        sentBy: 'bob',
      });
      workItem.setAsSentToIRS();
      expect(workItem.messages.length === 1).toBe(true);
      expect(workItem.completedMessage).toEqual('Served on IRS');
    });
  });
});
