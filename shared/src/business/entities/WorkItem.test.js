const assert = require('assert');

const WorkItem = require('./WorkItem');
const Message = require('./Message');

describe('WorkItem', () => {
  describe('isValid', () => {
    it('Creates a valid workitem', () => {
      const workItem = new WorkItem({
        messages: [],
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      assert.ok(workItem.isValid());
    });

    it('Update a valid workitem with a workItemId', () => {
      const workItem = new WorkItem({
        messages: [],
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      assert.ok(workItem.isValid());
    });

    it('Create a valid workitem without messages', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      assert.ok(workItem.isValid());
    });

    it('Create a valid workitem with real message', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
        messages: [
          {
            message: 'abc',
            userId: 'abc',
            sentBy: 'abc',
          },
        ],
      });
      assert.ok(workItem.isValid());
    });

    it('addMessage', () => {
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
        messages: [],
      });
      workItem.addMessage(
        new Message({
          message: 'abc',
          userId: 'abc',
          sentBy: 'abc',
        }),
      );
      assert.ok(workItem.messages.length === 1);
    });
  });
});
