const assert = require('assert');

const WorkItem = require('./WorkItem');
const Message = require('./Message');

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
      assert.ok(workItem.isValid());
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
      assert.ok(workItem.isValid());
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
      assert.ok(workItem.isValid());
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
            message: 'abc',
            sentBy: 'abc',
            userId: 'abc',
          },
        ],
        section: 'docket',
        sentBy: 'bob',
      });
      assert.ok(workItem.isValid());
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
          message: 'abc',
          sentBy: 'abc',
          userId: 'abc',
        }),
      );
      assert.ok(workItem.messages.length === 1);
    });

    it('when set as completed', () => {
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
      workItem.setAsCompleted('jane');
      expect(workItem.messages.length === 1).toBe(true);
      expect(workItem.messages[0].message).toEqual('work item completed');
    });
  });
});
