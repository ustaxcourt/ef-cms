import { runCompute } from 'cerebral/test';

import { formattedWorkQueue } from './formattedWorkQueue';

const FORMATTED_WORK_ITEM = {
  assigneeId: null,
  assigneeName: 'Unassigned',
  caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
  caseStatus: 'General Docket',
  createdAtFormatted: '12/27/2018',
  currentMessage: {
    createdAtFormatted: '12/27/2018',
    message: 'a Answer filed by respondent is ready for review',
    messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    sentBy: 'Test Respondent',
    sentTo: 'Unassigned',
    userId: 'respondent',
  },
  docketNumber: '101-18',
  document: {
    documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    documentType: 'Answer',
  },
  historyMessages: [
    {
      createdAtFormatted: '12/27/2018',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      sentBy: 'Test Docketclerk',
      sentTo: 'Unassigned',
      userId: 'docketclerk',
    },
  ],
  messages: [
    {
      createdAtFormatted: '12/27/2018',
      message: 'a Answer filed by respondent is ready for review',
      messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      sentBy: 'Test Respondent',
      sentTo: 'Unassigned',
      userId: 'respondent',
    },
    {
      createdAtFormatted: '12/27/2018',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      sentBy: 'Test Docketclerk',
      sentTo: 'Unassigned',
      userId: 'docketclerk',
    },
  ],
  section: 'docket',
  selected: false,
  sentBy: 'respondent',
  workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
};
describe('formatted work queue computed', () => {
  const workItem = {
    createdAt: '2018-12-27T18:05:54.166Z',
    assigneeName: null,
    caseStatus: 'general',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    document: {
      documentType: 'Answer',
      createdAt: '2018-12-27T18:05:54.164Z',
      documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    },
    messages: [
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
        message: 'a Answer filed by respondent is ready for review',
        userId: 'respondent',
        sentBy: 'Test Respondent',
      },
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
        message: 'a message',
        userId: 'docketclerk',
        sentBy: 'Test Docketclerk',
      },
    ],
    section: 'docket',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
    assigneeId: null,
    docketNumber: '101-18',
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
  };

  let result;
  beforeEach(() => {
    result = runCompute(formattedWorkQueue, {
      state: {
        workQueue: [workItem],
        selectedWorkItems: [],
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
});
