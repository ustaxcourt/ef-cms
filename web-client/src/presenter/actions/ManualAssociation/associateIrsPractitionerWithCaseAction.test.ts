import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { associateIrsPractitionerWithCaseAction } from './associateIrsPractitionerWithCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContextForClient;

describe('associateIrsPractitionerWithCaseAction', () => {
  it('should run associateIrsPractitionerWithCaseInteractor and success path', async () => {
    const successStub = jest.fn();

    presenter.providers.path = {
      success: successStub,
    };

    await runAction(associateIrsPractitionerWithCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
        modal: {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          user: {
            userId: 'sdfsd',
          },
        },
      },
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
