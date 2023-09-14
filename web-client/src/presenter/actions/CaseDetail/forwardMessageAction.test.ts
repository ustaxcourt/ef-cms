import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { forwardMessageAction } from './forwardMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('forwardMessageAction', () => {
  beforeAll(() => {
    applicationContext.getUseCases().forwardMessageInteractor.mockReturnValue({
      attachments: [
        { documentId: '546ea14f-833f-4576-a547-8ceb7f6282a2' },
        { documentId: 'eab4fc75-ef58-4966-a043-8a83e9a61391' },
        { documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873' },
      ],
      docketNumber: '123-45',
      parentMessageId: '123',
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call forwardMessageInteractor with the expected parameters and return the alertSuccess and parentMessageId', async () => {
    const result = await runAction(forwardMessageAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        modal: {
          form: {
            attachments: [
              {
                documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
                documentTitle: 'Petition',
              },
            ],
            draftAttachments: [
              {
                documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
                documentTitle: 'Petition Two',
              },
            ],
            message: 'You there!',
            parentMessageId: '499d51ae-f118-4eb6-bd0e-f2c351df8f06',
            subject: 'Hey!',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().forwardMessageInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().forwardMessageInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      attachments: [
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition',
        },
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition Two',
        },
      ],
      docketNumber: '101-20',
      message: 'You there!',
      parentMessageId: '499d51ae-f118-4eb6-bd0e-f2c351df8f06',
      subject: 'Hey!',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output).toHaveProperty('parentMessageId');
    expect(result.output).toMatchObject({
      messageViewerDocumentToDisplay: {
        documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
      },
    });
  });
});
