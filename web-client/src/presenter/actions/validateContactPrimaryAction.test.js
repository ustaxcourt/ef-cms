import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateContactPrimaryAction } from './validateContactPrimaryAction';
import sinon from 'sinon';

describe('validateContactPrimaryAction', () => {
  it('validates the primary contact', async () => {
    let successStub;
    let errorStub;

    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validatePrimaryContactInteractor: sinon.stub().returns(null),
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    const result = await runAction(validateContactPrimaryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          partyType: 'Petitioner',
        },
        contactToEdit: {
          contactPrimary: {},
        },
      },
    });

    expect(result.state.validationErrors.contactPrimary).toEqual({});
  });
});
