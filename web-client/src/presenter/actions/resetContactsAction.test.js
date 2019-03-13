import { runAction } from 'cerebral/test';

import { resetContactsAction } from './resetContactsAction';
import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../../../shared/src/business/entities/Contacts/PetitionContact';

describe('resetContactsAction', async () => {
  it('clears the contactPrimary except for countryType and email for a domestic address', async () => {
    const { state } = await runAction(resetContactsAction, {
      state: {
        caseDetail: {
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
          partyType: PARTY_TYPES.petitioner,
        },
        constants: {
          COUNTRY_TYPES,
          PARTY_TYPES,
        },
      },
    });
    expect(state.caseDetail).toEqual({
      contactPrimary: {
        countryType: 'domestic',
        email: 'test@example.com',
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('clears the contactPrimary except for countryType (which should be set back to the domestic default) and email for an international address', async () => {
    const { state } = await runAction(resetContactsAction, {
      state: {
        caseDetail: {
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
          partyType: PARTY_TYPES.petitioner,
        },
        constants: {
          COUNTRY_TYPES,
          PARTY_TYPES,
        },
      },
    });
    expect(state.caseDetail).toEqual({
      contactPrimary: {
        countryType: 'domestic',
        email: 'test@example.com',
      },
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('clears the contactPrimary except for countryType and email and clears the contactSecondary except for countryType', async () => {
    const { state } = await runAction(resetContactsAction, {
      state: {
        caseDetail: {
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
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        constants: {
          COUNTRY_TYPES,
          PARTY_TYPES,
        },
      },
    });
    expect(state.caseDetail).toEqual({
      contactPrimary: {
        countryType: 'domestic',
        email: 'test@example.com',
      },
      contactSecondary: { countryType: 'domestic' },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
  });
});
