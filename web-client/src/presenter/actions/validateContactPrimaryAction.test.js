import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateContactPrimaryAction } from './validateContactPrimaryAction';
import sinon from 'sinon';

describe('validateContactPrimaryAction', () => {
  it('validates the primary contact', async () => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validatePrimaryContactInteractor: sinon.stub().returns(null),
      }),
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
