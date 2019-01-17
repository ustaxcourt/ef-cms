import { runCompute } from 'cerebral/test';

import { extractedPendingMessagesFromCaseDetail } from '../../presenter/computeds/extractPendingMessagesFromCaseDetail';

export default test => {
  return it('Docketclerk views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(
      runCompute(extractedPendingMessagesFromCaseDetail, {
        state: test.getState(),
      }),
    ).toMatchObject([
      {
        assigneeId: null,
        assigneeName: 'Unassigned',
        caseStatus: 'new',
        currentMessage: {
          message: 'a Petition filed by taxpayer is ready for review',
          sentBy: 'Test Taxpayer',
          sentTo: 'Unassigned',
        },
        docketNumber: test.docketNumber,
        docketNumberSuffix: 'W',
        docketNumberWithSuffix: `${test.docketNumber}W`,
        document: {
          documentType: 'Petition',
        },
        historyMessages: [],
        messages: [
          {
            message: 'a Petition filed by taxpayer is ready for review',
            sentBy: 'Test Taxpayer',
            sentTo: 'Unassigned',
          },
        ],
        section: 'petitions',
        selected: false,
        sentBy: 'taxpayer',
      },
      {
        assigneeId: null,
        assigneeName: 'Unassigned',
        caseStatus: 'General Docket',
        currentMessage: {
          message: 'a Answer filed by respondent is ready for review',
          sentBy: 'Test Respondent',
          sentTo: 'Unassigned',
          userId: 'respondent',
        },
        docketNumber: test.docketNumber,
        docketNumberSuffix: 'W',
        docketNumberWithSuffix: `${test.docketNumber}W`,
        document: {
          documentType: 'Answer',
        },
        historyMessages: [],
        messages: [
          {
            message: 'a Answer filed by respondent is ready for review',
            sentBy: 'Test Respondent',
            sentTo: 'Unassigned',
            userId: 'respondent',
          },
        ],
        section: 'docket',
        selected: false,
        sentBy: 'respondent',
      },
      {
        assigneeId: null,
        assigneeName: 'Unassigned',
        caseStatus: 'General Docket',
        currentMessage: {
          message:
            'a Stipulated Decision filed by respondent is ready for review',
          sentBy: 'Test Respondent',
          sentTo: 'Unassigned',
          userId: 'respondent',
        },
        docketNumber: test.docketNumber,
        docketNumberSuffix: 'W',
        docketNumberWithSuffix: `${test.docketNumber}W`,
        document: {
          documentType: 'Stipulated Decision',
        },
        historyMessages: [],
        messages: [
          {
            message:
              'a Stipulated Decision filed by respondent is ready for review',
            sentBy: 'Test Respondent',
            sentTo: 'Unassigned',
            userId: 'respondent',
          },
        ],
        section: 'docket',
        selected: false,
        sentBy: 'respondent',
      },
    ]);
  });
};
