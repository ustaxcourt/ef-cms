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
        caseStatus: 'General Docket',
        docketNumber: test.docketNumber,
        document: {
          documentType: 'Answer',
        },
        messages: [
          {
            message: 'a Answer filed by respondent is ready for review',
            sentBy: 'Test Respondent',
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
        docketNumber: test.docketNumber,
        document: {
          documentType: 'Stipulated Decision',
        },
        messages: [
          {
            message:
              'a Stipulated Decision filed by respondent is ready for review',
            sentBy: 'Test Respondent',
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
