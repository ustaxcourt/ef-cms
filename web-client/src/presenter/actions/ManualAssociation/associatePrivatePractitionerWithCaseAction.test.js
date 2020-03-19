import { associatePrivatePractitionerWithCaseAction } from './associatePrivatePractitionerWithCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('associatePrivatePractitionerWithCaseAction', () => {
  it('should run associatePrivatePractitionerWithCaseInteractor and success path', async () => {
    const successStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        associatePrivatePractitionerWithCaseInteractor: () =>
          'hello from associate practitioner with case',
      }),
    };

    presenter.providers.path = {
      success: successStub,
    };

    await runAction(associatePrivatePractitionerWithCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: 'sdsdfsd' },
        modal: {
          representingPrimary: true,
          representingSecondary: false,
          user: {
            userId: 'sdfsd',
          },
        },
      },
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
