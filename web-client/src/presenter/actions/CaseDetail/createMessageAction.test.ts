import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createMessageAction } from './createMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createMessageAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call createMessageInteractor with the expected parameters and return the alertSuccess', async () => {
    const docIdOne = 'b1130321-0a76-43bc-b3eb-64a18f079873';
    const docIdTwo = 'b100000-0a76-43bc-b3eb-64a18f079873';

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
                documentId: docIdOne,
                documentTitle: 'Petition',
              },
            ],
            draftAttachments: [
              {
                documentId: docIdTwo,
                documentTitle: 'Petition Title',
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
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().createMessageInteractor.mock.calls[0][1],
    ).toMatchObject({
      attachments: [
        {
          documentId: docIdOne,
          documentTitle: 'Petition',
        },
        {
          documentId: docIdTwo,
          documentTitle: 'Petition Title',
        },
      ],
      docketNumber: '101-20',
      message: 'You there!',
      subject: 'Hey!',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });
});
