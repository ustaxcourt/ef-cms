import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitCourtIssuedDocketEntryAction } from './submitCourtIssuedDocketEntryAction';

describe('submitCourtIssuedDocketEntryAction', () => {
  const mockDocketNumber = '123-20';
  const mockForm = {
    attachments: false,
    date: '2019-01-01T00:00:00.000Z',
    documentTitle: '[Anything]',
    documentType: 'Order',
    eventCode: 'O',
    freeText: 'Testing',
    generatedDocumentTitle: 'Order F',
    scenario: 'Type A',
  };
  const mockDocketEntryId = 'cf5a5a91-0dff-44d3-aad6-bdae49197bef';

  presenter.providers.applicationContext = applicationContext;

  const { fileCourtIssuedDocketEntryInteractor } =
    applicationContext.getUseCases();

  it('should make a call to file the court-issued docket entry specified in state.form', async () => {
    await runAction(submitCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketEntryId: mockDocketEntryId,
        form: mockForm,
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumbers: [],
      documentMeta: { ...mockForm, docketEntryId: mockDocketEntryId },
      subjectDocketNumber: mockDocketNumber,
    });
  });

  it('forwards pendingCoversheetDocketEntryIds from the interactor response so the sequence polls when the backend enqueued coversheet jobs', async () => {
    fileCourtIssuedDocketEntryInteractor.mockResolvedValueOnce({
      pendingCoversheetDocketEntryIds: ['abc'],
    });

    const { output } = await runAction(submitCourtIssuedDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '123-20' },
        docketEntryId: 'abc',
        form: mockForm,
      },
    });

    expect(output.pendingCoversheetDocketEntryIds).toEqual(['abc']);
  });

  it('returns no pendingCoversheetDocketEntryIds when the backend did not enqueue any coversheet jobs', async () => {
    fileCourtIssuedDocketEntryInteractor.mockResolvedValueOnce({});

    const { output } = await runAction(submitCourtIssuedDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: mockDocketNumber },
        docketEntryId: mockDocketEntryId,
        form: mockForm,
      },
    });

    expect(output.pendingCoversheetDocketEntryIds).toBeUndefined();
  });

  it('should return docketEntryId to props', async () => {
    const { output } = await runAction(submitCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketEntryId: mockDocketEntryId,
        form: mockForm,
      },
    });

    expect(output.docketEntryId).toBe(mockDocketEntryId);
  });
});
