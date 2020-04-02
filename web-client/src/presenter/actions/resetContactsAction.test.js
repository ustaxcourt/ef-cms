import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { resetContactsAction } from './resetContactsAction';
import { runAction } from 'cerebral/test';

describe('resetContactsAction', () => {
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
            countryType: 'domestic',
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: 'domestic',
        email: 'test@example.com',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
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
            countryType: 'international',
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            zip: '12345',
          },
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: 'domestic',
        email: 'test@example.com',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
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
            countryType: 'domestic',
            email: 'test@example.com',
            name: 'Bob',
            phone: '1234567890',
            state: 'AL',
            zip: '12345',
          },
          contactSecondary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: 'domestic',
            name: 'Bob',
            state: 'AL',
            zip: '12345',
          },
          partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: 'domestic',
        email: 'test@example.com',
      },
      contactSecondary: { countryType: 'domestic' },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
  });
});
