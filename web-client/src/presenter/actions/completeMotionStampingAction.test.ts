import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { completeMotionStampingAction } from './completeMotionStampingAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('completeMotionStampingAction', () => {
  const { generateDraftStampOrderInteractor } =
    applicationContext.getUseCases();
  const { uploadDocumentFromClient } =
    applicationContext.getPersistenceGateway();

  const docketNumber = '123';

  const mockDocketEntryId = applicationContext.getUniqueId();

  applicationContext
    .getUseCases()
    .saveSignedDocumentInteractor.mockReturnValue({
      stampedDocketEntryId: mockDocketEntryId,
    });

  let mockState;
  let mockStampedDocketEntryId;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    mockStampedDocketEntryId = '20354d7a-e4fe-47af-8ff6-187bca92f3f9';
    applicationContext.getUniqueId.mockReturnValue(mockStampedDocketEntryId);

    mockState = {
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          },
        ],
        docketNumber,
      },
      form: {
        customText: 'custom text here',
        date: '2022-07-27T04:00:00.000Z',
        day: '27',
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: 'Denied',
        dueDateMessage: 'The parties shall file a status report by',
        jurisdictionalOption: 'The case is restored to the general docket',
        month: '07',
        strickenFromTrialSession:
          'This case is stricken from the trial session',
        year: '2022',
      },
      pdfForSigning: {
        docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        nameForSigning: 'Buch',
        nameForSigningLine2: 'Judge',
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
    });

    global.File = jest.fn();

    uploadDocumentFromClient.mockReturnValue(
      'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  it('should add a draft stamp order docket entry and generate a stamped coversheet', async () => {
    const result = await runAction(completeMotionStampingAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(generateDraftStampOrderInteractor.mock.calls.length).toBe(1);
    expect(result.output).toMatchObject({
      docketNumber,
      tab: 'docketRecord',
    });
  });

  it('should construct a redirectUrl to the draft documents view', async () => {
    const result = await runAction(completeMotionStampingAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(result.output).toMatchObject({
      redirectUrl: `/case-detail/${docketNumber}/draft-documents?docketEntryId=${mockStampedDocketEntryId}`,
    });
  });

  it('should construct a redirectUrl to the message detail document view if there is a parentMessageId present in state', async () => {
    const parentMessageId = applicationContext.getUniqueId();

    const result = await runAction(completeMotionStampingAction, {
      modules: {
        presenter,
      },
      state: {
        ...mockState,
        parentMessageId,
      },
    });

    expect(result.output).toMatchObject({
      redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${mockStampedDocketEntryId}`,
    });
  });

  it('should return the stamped document docket entry id as props', async () => {
    const result = await runAction(completeMotionStampingAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(result.output.docketEntryId).toEqual(mockStampedDocketEntryId);
  });
});
