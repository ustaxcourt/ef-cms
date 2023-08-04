import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { updateCaseHearing } from './updateCaseHearing';

describe('updateCaseHearing', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('invokes the persistence layer with pk of case|{docketNumber}, sk of hearing|{trialSessionId} and other expected params', async () => {
    await updateCaseHearing({
      applicationContext,
      docketNumber: '123-45',
      hearingToUpdate: {
        caseOrder: [
          {
            calendarNotes: 'Heyo!',
            docketNumber: '123-45',
          },
        ],
        trialSessionId: '123',
      } as any,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        caseOrder: [
          {
            calendarNotes: 'Heyo!',
            docketNumber: '123-45',
          },
        ],
        pk: 'case|123-45',
        sk: 'hearing|123',
        trialSessionId: '123',
      },
    });
  });
});
