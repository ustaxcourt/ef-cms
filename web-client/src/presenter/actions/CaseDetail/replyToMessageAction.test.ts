import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { replyToMessageAction } from './replyToMessageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('replyToMessageAction', () => {
  const forwardedDocOne = '546ea14f-833f-4576-a547-8ceb7f6282a2';
  const forwardedDocTwo = 'eab4fc75-ef58-4966-a043-8a83e9a61391';

  const firstAttachedMessageId = 'b1130321-0a76-43bc-b3eb-64a18f079873';

  const selectedDocumentIdOne = 'b1135321-0a76-43bc-b3eb-64a18f55555';

  beforeAll(() => {
    applicationContext.getUseCases().replyToMessageInteractor.mockReturnValue({
      attachments: [
        { documentId: forwardedDocOne },
        { documentId: forwardedDocTwo },
        { documentId: firstAttachedMessageId },
      ],
      docketNumber: '123-45',
      parentMessageId: '123',
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call replyToMessageInteractor with the expected parameters and return the alertSuccess and parentMessageId', async () => {
    const result = await runAction(replyToMessageAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: {
          form: {
            attachments: [
              {
                documentId: firstAttachedMessageId,
                documentTitle: 'Petition',
              },
            ],
            draftAttachments: [
              {
                documentId: selectedDocumentIdOne,
                documentTitle: 'Petition Title',
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
      applicationContext.getUseCases().replyToMessageInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().replyToMessageInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      attachments: [
        {
          documentId: firstAttachedMessageId,
          documentTitle: 'Petition',
        },
        {
          documentId: selectedDocumentIdOne,
          documentTitle: 'Petition Title',
        },
      ],
      docketNumber: '123-45',
      message: 'You there!',
      parentMessageId: '499d51ae-f118-4eb6-bd0e-f2c351df8f06',
      subject: 'Hey!',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output).toHaveProperty('parentMessageId');
    expect(result.output).toMatchObject({
      messageViewerDocumentToDisplay: {
        documentId: firstAttachedMessageId,
      },
    });
  });
});
