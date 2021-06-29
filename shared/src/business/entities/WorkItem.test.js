const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
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
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          section: DOCKET_SECTION,
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
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          section: DOCKET_SECTION,
          sentBy: 'bob',
        },
        { applicationContext },
      );
      workItem.setStatus(CASE_STATUS_TYPES.new);
      expect(workItem.caseStatus).toEqual(CASE_STATUS_TYPES.new);
      expect(workItem.isValid()).toBeTruthy();
    });

    it('Update a valid workitem with a workItemId', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          section: DOCKET_SECTION,
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
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          isRead: true,
          section: DOCKET_SECTION,
          sentBy: 'bob',
          workItemId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });
  });

  it('assigns user provided to `assignUser`', () => {
    const workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {},
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
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

  it('is set high priority if case is calendared or overridden', () => {
    let workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {},
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        section: DOCKET_SECTION,
        sentBy: 'bob',
      },
      { applicationContext },
    );
    expect(workItem.highPriority).toBe(false);

    workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.calendared,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {},
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        section: DOCKET_SECTION,
        sentBy: 'bob',
      },
      { applicationContext },
    );
    expect(workItem.highPriority).toBe(true);

    workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {},
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        highPriority: true,
        section: DOCKET_SECTION,
        sentBy: 'bob',
      },
      { applicationContext },
    );
    expect(workItem.highPriority).toBe(true);
  });

  it('Creates a workItem containing a docketEntry with only the picked fields', () => {
    const workItem = new WorkItem(
      {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Proposed Stipulated Decision',
          documentType: 'Proposed Stipulated Decision',
          editState: {},
          eventCode: 'PSDE',
          filedBy: 'Test Petitioner',
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 5,
          isFileAttached: true,
          processingStatus: 'pending',
          receivedAt: '2018-03-01T00:01:00.000Z',
          servedAt: '2019-08-25T05:00:00.000Z',
        },
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        section: DOCKET_SECTION,
        sentBy: 'bob',
      },
      { applicationContext },
    );
    expect(workItem.docketEntry.docketNumber).toBeUndefined();
    expect(workItem.docketEntry.editState).toBeUndefined();
    expect(workItem.docketEntry.processingStatus).toBeUndefined();
    expect(workItem.docketEntry.documentTitle).toEqual(
      'Proposed Stipulated Decision',
    );
  });

  describe('markAsRead', () => {
    it('should set isRead to true', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.new,
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          section: DOCKET_SECTION,
          sentBy: 'bob',
        },
        { applicationContext },
      );

      expect(workItem.isRead).toBeFalsy();

      workItem.markAsRead();

      expect(workItem.isRead).toBeTruthy();
    });
  });
});
