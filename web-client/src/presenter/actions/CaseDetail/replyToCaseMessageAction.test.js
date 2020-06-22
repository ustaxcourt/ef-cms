import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { replyToCaseMessageAction } from './replyToCaseMessageAction';
import { runAction } from 'cerebral/test';

describe('replyToCaseMessageAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .replyToCaseMessageInteractor.mockReturnValue({
        docketNumber: '123-45',
        parentMessageId: '123',
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call replyToCaseMessageInteractor with the expected parameters and return the alertSuccess and parentMessageId', async () => {
    const result = await runAction(replyToCaseMessageAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'a7806fa0-ce6a-41ca-b66e-59438953f8bb',
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
      applicationContext.getUseCases().replyToCaseMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().replyToCaseMessageInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      attachments: [
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition',
        },
      ],
      caseId: 'a7806fa0-ce6a-41ca-b66e-59438953f8bb',
      message: 'You there!',
      parentMessageId: '499d51ae-f118-4eb6-bd0e-f2c351df8f06',
      subject: 'Hey!',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output).toHaveProperty('parentMessageId');
  });
});
