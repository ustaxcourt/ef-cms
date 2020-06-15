import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseMessageAction } from './createCaseMessageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createCaseMessageAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call createCaseMessageInteractor with the expected parameters and return the alertSuccess', async () => {
    const result = await runAction(createCaseMessageAction, {
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
            subject: 'Hey!',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().createCaseMessageInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().createCaseMessageInteractor.mock
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
      subject: 'Hey!',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });
});
