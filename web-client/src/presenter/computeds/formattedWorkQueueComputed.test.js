import { formattedWorkQueue as formattedWorkQueueComputed } from './formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

import {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed, {
  getCurrentUser: () => ({
    role: 'petitionsclerk',
  }),
  getUtilities: () => {
    return {
      createISODateString,
      formatDateString,
      prepareDateFromString,
    };
  },
});

const FORMATTED_WORK_ITEM = {
  assigneeId: null,
  assigneeName: 'Unassigned',
  caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
  caseStatus: 'General Docket - Not at Issue',
  createdAtFormatted: '12/27/18',
  currentMessage: {
    createdAtFormatted: '12/27/18',
    from: 'Test Respondent',
    fromUserId: 'respondent',
    message: 'Answer filed by respondent is ready for review',
    messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    to: 'Unassigned',
  },
  docketNumber: '101-18',
  document: {
    documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    documentType: 'Answer',
  },
  historyMessages: [
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Docketclerk',
      fromUserId: 'docketclerk',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
  ],
  messages: [
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Respondent',
      fromUserId: 'respondent',
      message: 'Answer filed by respondent is ready for review',
      messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Docketclerk',
      fromUserId: 'docketclerk',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
  ],
  section: 'docket',
  selected: true,
  sentBy: 'respondent',
  showComplete: true,
  showSendTo: true,
  workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
};
describe('formatted work queue computed', () => {
  const workItem = {
    assigneeId: null,
    assigneeName: null,
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: 'General Docket - Not at Issue',
    createdAt: '2018-12-27T18:05:54.166Z',
    docketNumber: '101-18',
    document: {
      createdAt: '2018-12-27T18:05:54.164Z',
      documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
      documentType: 'Answer',
    },
    messages: [
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Respondent',
        fromUserId: 'respondent',
        message: 'Answer filed by respondent is ready for review',
        messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Docketclerk',
        fromUserId: 'docketclerk',
        message: 'a message',
        messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
    ],
    section: 'docket',
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };

  let result;
  beforeEach(() => {
    result = runCompute(formattedWorkQueue, {
      state: {
        selectedWorkItems: [workItem],
        workQueue: [workItem],
      },
    });
  });

  it('formats the workitems', () => {
    expect(result[0]).toMatchObject(FORMATTED_WORK_ITEM);
  });

  it('adds a currentMessage', () => {
    expect(result[0].currentMessage.messageId).toEqual(
      '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    );
  });

  it('adds a historyMessages array without the current message', () => {
    expect(result[0].historyMessages.length).toEqual(1);
    expect(result[0].historyMessages[0].messageId).toEqual(
      '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    );
  });

  it('sets showSendTo and showComplete', () => {
    workItem.isInitializeCase = true;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        selectedWorkItems: [],
        workQueue: [workItem],
      },
    });
    expect(result2[0].showSendTo).toBeFalsy();
    expect(result2[0].showComplete).toBeFalsy();
  });
  it('sets showBatchedStatusIcon when false', () => {
    workItem.isInitializeCase = true;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        selectedWorkItems: [],
        workQueue: [workItem],
      },
    });
    expect(result2[0].showBatchedStatusIcon).toBeFalsy();
  });
  it('sets showBatchedStatusIcon when true', () => {
    workItem.isInitializeCase = true;
    workItem.caseStatus = 'Batched for IRS';
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        selectedWorkItems: [],
        workQueue: [workItem],
      },
    });
    expect(result2[0].showBatchedStatusIcon).toBeTruthy();
  });

  it('sets showBatchedStatusIcon to recalled', () => {
    workItem.isInitializeCase = true;
    workItem.caseStatus = 'Recalled';
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        selectedWorkItems: [],
        workQueue: [workItem],
      },
    });
    expect(result2[0].showRecalledStatusIcon).toBeTruthy();
    expect(result2[0].showUnreadIndicators).toEqual(true);
  });
});
