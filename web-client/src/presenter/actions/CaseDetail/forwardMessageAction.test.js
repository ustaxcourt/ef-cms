import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { forwardMessageAction } from './forwardMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('forwardMessageAction', () => {
  beforeAll(() => {
    applicationContext.getUseCases().forwardMessageInteractor.mockReturnValue({
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
            message: 'You there!',
            parentMessageId: '499d51ae-f118-4eb6-bd0e-f2c351df8f06',
            subject: 'Hey!',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().forwardMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().forwardMessageInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      attachments: [
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition',
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
