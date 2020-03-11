import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/cases/CaseConstants';
import { associateIrsPractitionerWithCaseAction } from './associateIrsPractitionerWithCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('associateIrsPractitionerWithCaseAction', () => {
  it('should run associateIrsPractitionerWithCaseInteractor and success path', async () => {
    const successStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        associateIrsPractitionerWithCaseInteractor: () =>
          'hello from associate respondent with case',
      }),
    };

    presenter.providers.path = {
      success: successStub,
    };

    await runAction(associateIrsPractitionerWithCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: 'sdsdfsd' },
        modal: {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          user: {
            userId: 'sdfsd',
          },
        },
      },
    });
    expect(successStub.calledOnce).toEqual(true);
  });
});
