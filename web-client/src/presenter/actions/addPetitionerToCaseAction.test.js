import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { addPetitionerToCaseAction } from './addPetitionerToCaseAction';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('addPetitionerToCaseAction', () => {
  const mockContact = {
    address1: '123 cat lane',
    caseCaption: 'A test caption',
    contactType: CONTACT_TYPES.petitioner,
    name: 'Selena Kyle',
  };

  const baseState = {
    caseDetail: {
      docketNumber: '999-99',
    },
    constants: {
      CONTACT_TYPES,
    },
  };

  presenter.providers.applicationContext = applicationContext;

  it('sets state.alertSuccess from props.alertSuccess for a Petitioner', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.alertSuccess).toEqual({
      message: `Petitioner ${mockContact.name} has been added to the case.`,
    });
  });

  it('sets state.alertSuccess from props.alertSuccess for a Participant', async () => {
    mockContact.contactType = CONTACT_TYPES.participant;

    const result = await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.alertSuccess).toEqual({
      message: `Participant ${mockContact.name} has been added to the case.`,
    });
  });

  it('returns caseInfo as props.tab', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.tab).toBe('caseInfo');
  });

  it('returns form.contact.contactType as props.contactType', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        ...baseState,
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.contactType).toBe(mockContact.contactType);
  });

  it('calls addPetitionerToCaseInteractor with params from state.form', async () => {
    await runAction(addPetitionerToCaseAction, {
      modules: { presenter },
      state: {
        ...baseState,
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
