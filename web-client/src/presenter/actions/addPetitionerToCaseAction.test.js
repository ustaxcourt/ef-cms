import { addPetitionerToCaseAction } from './addPetitionerToCaseAction';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('addPetitionerToCaseAction', () => {
  const mockContact = {
    address1: '123 cat lane',
    caseCaption: 'A test caption',
    name: 'Selena Kyle',
  };

  presenter.providers.applicationContext = applicationContext;

  it('sets state.alertSuccess from props.alertSuccess', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '999-99',
        },
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.alertSuccess).toEqual({
      message: `Petitioner ${mockContact.name} has been added to case.`,
    });
  });

  it('returns caseInfo as props.tab', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '999-99',
        },
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.tab).toBe('caseInfo');
  });

  it('calls addPetitionerToCaseInteractor with params from state.form', async () => {
    await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '999-99',
        },
        form: {
          contact: mockContact,
        },
      },
    });

    expect(
      applicationContext.getUseCases().addPetitionerToCaseInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseCaption: mockContact.caseCaption,
      contact: mockContact,
      docketNumber: '999-99',
    });
  });
});
