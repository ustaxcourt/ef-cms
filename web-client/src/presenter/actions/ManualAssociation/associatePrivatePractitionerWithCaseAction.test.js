import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { associatePrivatePractitionerWithCaseAction } from './associatePrivatePractitionerWithCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContextForClient;

describe('associatePrivatePractitionerWithCaseAction', () => {
  it('should run associatePrivatePractitionerWithCaseInteractor and success path', async () => {
    const successStub = jest.fn();

    presenter.providers.path = {
      success: successStub,
    };

    await runAction(associatePrivatePractitionerWithCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
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
