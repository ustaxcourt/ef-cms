import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext.js';
import { presenter } from '../../presenter-mock';
import { resetContactsAction } from './resetContactsAction';
import { runAction } from 'cerebral/test';

describe('resetContactsAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();
  it('clears the contactPrimary except for countryType for a domestic address', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: COUNTRY_TYPES.DOMESTIC,
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
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('clears the contactPrimary except for countryType (which should be set back to the domestic default) for an international address', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            country: 'Germany',
            countryType: 'international',
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
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('clears the contactPrimary except for countryType and clears the contactSecondary except for countryType', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: COUNTRY_TYPES.DOMESTIC,
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
      },
      contactSecondary: { countryType: COUNTRY_TYPES.DOMESTIC },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
  });

  it('unsets the contactSecondary when the party type only includes a primary contact', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: COUNTRY_TYPES.DOMESTIC,
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
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(state.form).toEqual({
      contactPrimary: {
        countryType: COUNTRY_TYPES.DOMESTIC,
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });
});
