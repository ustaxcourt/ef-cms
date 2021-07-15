import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { resetContactsAction } from './resetContactsAction';
import { runAction } from 'cerebral/test';

describe('resetContactsAction', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('clears the contactPrimary except for countryType and email for a domestic address', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'test@example.com',
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('clears the contactPrimary except for countryType (which should be set back to the domestic default) and email for an international address', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            country: 'Germany',
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            zip: '12345',
          },
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'test@example.com',
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('clears the contactPrimary except for countryType and email and clears the contactSecondary except for countryType', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
          contactSecondary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Bob',
            state: 'AL',
            zip: '12345',
          },
          partyType: PARTY_TYPES.petitionerSpouse,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'test@example.com',
      },
      contactSecondary: { countryType: COUNTRY_TYPES.DOMESTIC },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
  });

  it('persists the contactId on both the contactPrimary and contactSecondary if they are prepopulated', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            contactId: '7805d1ab-18d0-43ec-bafb-654e83405417',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
          contactSecondary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            contactId: '1805d1ab-18d0-43ec-bafb-654e83405417',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Bob',
            state: 'AL',
            zip: '12345',
          },
          partyType: PARTY_TYPES.petitionerSpouse,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405417',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'test@example.com',
      },
      contactSecondary: {
        contactId: '1805d1ab-18d0-43ec-bafb-654e83405417',
        countryType: COUNTRY_TYPES.DOMESTIC,
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
  });

  it('delete the contactSecondary from the state.form if the party type does not required a contactSecondary', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            contactId: '7805d1ab-18d0-43ec-bafb-654e83405417',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
          contactSecondary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            contactId: '1805d1ab-18d0-43ec-bafb-654e83405417',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Bob',
            state: 'AL',
            zip: '12345',
          },
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405417',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'test@example.com',
      },
      contactSecondary: undefined,
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('delete the useSameAsPrimary from state.form', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            contactId: '7805d1ab-18d0-43ec-bafb-654e83405417',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
        },
      },
    });

    expect(state.form.useSameAsPrimary).toBeUndefined();
  });
});
