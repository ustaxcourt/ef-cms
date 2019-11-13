import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedDocketEntryAction } from './submitCourtIssuedDocketEntryAction';

describe('submitCourtIssuedDocketEntryAction', () => {
  let fileCourtIssuedDocketEntryInteractorMock;

  beforeEach(() => {
    fileCourtIssuedDocketEntryInteractorMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        fileCourtIssuedDocketEntryInteractor: fileCourtIssuedDocketEntryInteractorMock,
      }),
    };
  });

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
          documentTitle: 'Order [Anything]',
          documentType: 'O - Order',
          eventCode: 'O',
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(fileCourtIssuedDocketEntryInteractorMock).toHaveBeenCalled();
  });
});
