import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from './EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { WorkItem } from './WorkItem';
import { applicationContext } from '../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';

describe('WorkItem', () => {
  describe('isValid', () => {
    let aValidWorkItem;

    beforeEach(() => {
      aValidWorkItem = {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        assigneeName: 'bob',
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {},
        docketNumber: '101-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        section: DOCKET_SECTION,
        sentBy: 'bob',
      };
    });

    it('Creates a valid workitem', () => {
      const workItem = new WorkItem(aValidWorkItem, { applicationContext });
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
          workItemId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
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
          workItemId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBeTruthy();
    });

    it('should create a valid workitem when caseStatus is calendared', () => {
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.calendared,
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          isRead: true,
          section: DOCKET_SECTION,
          sentBy: 'bob',
          trialDate: '2018-11-21T20:49:28.192Z',
          trialLocation: 'Fairbanks, Alaska',
          workItemId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
        },
        { applicationContext },
      );
      expect(workItem.isValid()).toBe(true);
    });

    it('should set properties on WorkItem that pertain to the Case when a Case entity is passed into the constructor', () => {
      aValidWorkItem.associatedJudge = 'This should be overwritten';
      aValidWorkItem.caseStatus = CASE_STATUS_TYPES.closed;
      aValidWorkItem.leadDocketNumber = '100-23';
      aValidWorkItem.docketNumberWithSuffix = '123-23';
      aValidWorkItem.trialDate = 'This should be overwritten';
      aValidWorkItem.trialLocation = 'This should be overwritten';
      const mockCase = cloneDeep(MOCK_CASE);
      mockCase.associatedJudge = 'Some Judge';
      mockCase.status = CASE_STATUS_TYPES.generalDocket;
      mockCase.leadDocketNumber = undefined;
      mockCase.docketNumberWithSuffix = '123-23S';
      mockCase.trialDate = '2018-11-21T20:49:28.192Z';
      mockCase.trialLocation = 'Seattle, WA';

      const workItem = new WorkItem(
        aValidWorkItem,
        { applicationContext },
        mockCase,
      );

      expect(workItem.isValid()).toBeTruthy();
      expect(workItem.associatedJudge).toBe(mockCase.associatedJudge);
      expect(workItem.caseStatus).toBe(mockCase.status);
      expect(workItem.leadDocketNumber).toBe(mockCase.leadDocketNumber);
      expect(workItem.docketNumberWithSuffix).toBe(
        mockCase.docketNumberWithSuffix,
      );
      expect(workItem.trialDate).toBe(mockCase.trialDate);
      expect(workItem.trialLocation).toBe(mockCase.trialLocation);
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

  it('creates a workItem containing a docketEntry with only the picked fields', () => {
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
        leadDocketNumber: '101-18',
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
