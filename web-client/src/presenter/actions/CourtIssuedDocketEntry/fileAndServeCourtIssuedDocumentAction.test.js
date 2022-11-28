import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fileAndServeCourtIssuedDocumentAction } from './fileAndServeCourtIssuedDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('submitCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const clientConnectionId = 'ABC123';
  const docketNumbers = ['123-20'];

  it('should call the interactor for filing and serving court-issued documents and pass the current clientConnectId', async () => {
    const thisDocketNumber = '123-20';

    await runAction(fileAndServeCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers,
      },
      state: {
        caseDetail: {
          docketNumber: thisDocketNumber,
        },
        clientConnectionId,
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
      applicationContext.getUseCases()
        .fileAndServeCourtIssuedDocumentInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][1].docketNumbers,
    ).toEqual([thisDocketNumber]);
    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][2],
    ).toEqual(clientConnectionId);
  });
});
