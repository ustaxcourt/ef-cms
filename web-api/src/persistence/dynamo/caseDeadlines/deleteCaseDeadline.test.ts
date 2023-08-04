import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCaseDeadline } from './deleteCaseDeadline';

describe('deleteCaseDeadline', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

  const mockCaseDeadline = {
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  };

  beforeEach(() => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () => Promise.resolve({ Item: mockCaseDeadline }),
    });
  });

  it('deletes the case deadline records', async () => {
    await deleteCaseDeadline({
      applicationContext,
      caseDeadlineId: CASE_DEADLINE_ID,
      docketNumber: '456-20',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `case-deadline|${CASE_DEADLINE_ID}`,
        sk: `case-deadline|${CASE_DEADLINE_ID}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[1][0],
    ).toMatchObject({
      Key: {
        pk: 'case|456-20',
        sk: `case-deadline|${CASE_DEADLINE_ID}`,
      },
    });
  });

  it('does not call delete function if original case deadline is not found', async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () => Promise.resolve({}),
    });

    await deleteCaseDeadline({
      applicationContext,
      caseDeadlineId: CASE_DEADLINE_ID,
      docketNumber: '456-20',
    });

    expect(
      applicationContext.getDocumentClient().delete,
    ).not.toHaveBeenCalled();
  });
});
