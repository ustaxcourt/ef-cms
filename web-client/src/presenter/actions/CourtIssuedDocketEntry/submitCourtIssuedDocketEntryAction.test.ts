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
