import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedDocketEntryAction } from './submitCourtIssuedDocketEntryAction';

describe('submitCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('Calls the interactor for filing a court-issued docket entry', async () => {
    await runAction(submitCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '123',
        },
        documentId: 'abc',
        form: {
          attachments: false,
          date: '2019-01-01T00:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'Order',
          eventCode: 'O',
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
  });
});
