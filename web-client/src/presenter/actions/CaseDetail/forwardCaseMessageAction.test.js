import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { forwardCaseMessageAction } from './forwardCaseMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('forwardCaseMessageAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .forwardCaseMessageInteractor.mockReturnValue({
        docketNumber: '123-45',
        parentMessageId: '123',
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call forwardCaseMessageInteractor with the expected parameters and return the alertSuccess and parentMessageId', async () => {
    const result = await runAction(forwardCaseMessageAction, {
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
      applicationContext.getUseCases().forwardCaseMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().forwardCaseMessageInteractor.mock
        .calls[0][0],
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
  });
});
