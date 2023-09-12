import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCourtIssuedDocketEntryAction } from './updateCourtIssuedDocketEntryAction';

describe('updateCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('Calls the interactor for filing a court-issued docket entry', async () => {
    await runAction(updateCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        docketEntryId: 'abc',
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
      applicationContext.getUseCases().updateCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
  });
});
