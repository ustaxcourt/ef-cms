import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createMessageAction } from './createMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createMessageAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call createMessageInteractor with the expected parameters and return the alertSuccess', async () => {
    const result = await runAction(createMessageAction, {
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
            subject: 'Hey!',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().createMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().createMessageInteractor.mock.calls[0][1],
    ).toMatchObject({
      attachments: [
        {
          documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
          documentTitle: 'Petition',
        },
      ],
      docketNumber: '101-20',
      message: 'You there!',
      subject: 'Hey!',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });
});
