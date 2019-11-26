import { ContactFactory } from '../../../../../shared/src/business/entities/contacts/ContactFactory';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { resetContactsAction } from './resetContactsAction';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('resetContactsAction', () => {
  it('clears the contactPrimary except for countryType for a domestic address', async () => {
    const { state } = await runAction(resetContactsAction, {
      modules: { presenter },
      state: {
        form: {
          contactPrimary: {
            address1: '123 Abc Ln',
            city: 'Bobville',
            countryType: 'domestic',
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
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
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
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: 'domestic',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
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
            countryType: 'domestic',
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
      },
      contactSecondary: { countryType: 'domestic' },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
  });
});
