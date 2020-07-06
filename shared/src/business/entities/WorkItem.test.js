const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('./EntityConstants');
const { Message } = require('./Message');
const { WorkItem } = require('./WorkItem');

describe('WorkItem', () => {
  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new WorkItem({}, {})).toThrow();
    });

    it('Creates a valid workitem', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [],
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Creates a valid workitem when using setStatus', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [],
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      workItem.setStatus(CASE_STATUS_TYPES.new);
      expect(workItem.caseStatus).toEqual(CASE_STATUS_TYPES.new);
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Returns a reference to a valid workItem when calling setAsInternal', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [],
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      const updatedWorkItem = workItem.setAsInternal();
      expect(updatedWorkItem.isQC).toEqual(false);
      expect(updatedWorkItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a workItemId', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [],
          section: 'docket',
          sentBy: 'bob',
          workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a isRead', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          isRead: true,
          messages: [],
          section: 'docket',
          sentBy: 'bob',
          workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Create a valid workitem without messages', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Create a valid workitem with real message', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [
            {
              from: 'abc',
              fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'abc',
            },
          ],
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });
  });

  describe('Adding messages to WorkItems', () => {
    let workItem;
    beforeAll(() => {
      workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [
            {
              createdAt: '2012-08-09T12:34:56.000Z',
              from: 'somebody',
              fromUserId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
              message: 'third',
            },
            {
              createdAt: '2010-08-09T12:34:56.000Z',
              from: 'somebody',
              fromUserId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
              message: 'first',
            },
            {
              createdAt: '2012-01-09T12:34:56.000Z',
              from: 'somebody',
              fromUserId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
              message: 'second',
            },
          ],
          section: 'docket',
          sentBy: 'bob',
        },
        { applicationContext },
      );
    });

    it('getLatestMessageEntity correctly returns most recent `createdAt` Message entity', () => {
      expect(workItem.getLatestMessageEntity()).toMatchObject({
        message: 'third',
      });
    });

    it('Creates a valid workItem and returns reference to the workItem when calling addMessage', () => {
      expect(workItem.messages.length).toEqual(3);
      const updatedWorkItem = workItem.addMessage(
        new Message(
          {
            from: 'somebody',
            fromUserId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
            message: 'this is a new message',
          },
          { applicationContext },
        ),
      );
      expect(workItem.messages.length).toEqual(4);
      expect(updatedWorkItem.isValid()).toBeTruthy();
    });

    it('no message added when set as completed', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          docketNumberSuffix: 'S',
          document: {},
          isQC: true,
          messages: [],
          sentBy: 'bob',
        },
        { applicationContext },
      );
      workItem.setAsCompleted({
        user: { name: 'jane', userId: '6805d1ab-18d0-43ec-bafb-654e83405416' },
      });
      expect(workItem.messages.length === 0).toBe(true);
    });
  });

  it('assigns user provided to `assignUser`', () => {
    const workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {},
        isQC: true,
        messages: [],
        sentBy: 'bob',
      },
      { applicationContext },
    );

    const assignment = {
      assigneeId: '111cd447-6278-461b-b62b-d9e357eea62c',
      assigneeName: 'Joe',
      section: 'Some Section',
      sentBy: 'Sender Name',
      sentBySection: 'Sender Section',
      sentByUserId: '222cd447-6278-461b-b62b-d9e357eea62c',
    };
    workItem.assignToUser(assignment);
    expect(workItem.toRawObject()).toMatchObject(assignment);
  });
});
