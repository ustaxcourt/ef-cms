import { runAction } from 'cerebral/test';

import { resetContactsAction } from './resetContactsAction';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/Contacts/PetitionContact';

describe('resetContactsAction', async () => {
  it('clears the contactPrimary except for countryType and email for a domestic address', async () => {
    const { state } = await runAction(resetContactsAction, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
          contactPrimary: {
            name: 'Bob',
            address1: '123 Abc Ln',
            countryType: 'domestic',
            city: 'Bobville',
            state: 'AL',
            zip: '12345',
            phone: '1234567890',
            email: 'test@example.com',
          },
        },
        constants: {
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

  it('clears the contactPrimary except for countryType and email for an international address', async () => {
    const { state } = await runAction(resetContactsAction, {
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
          contactPrimary: {
            name: 'Bob',
            address1: '123 Abc Ln',
            countryType: 'international',
            country: 'Germany',
            city: 'Bobville',
            zip: '12345',
            phone: '1234567890',
            email: 'test@example.com',
          },
        },
        constants: {
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
          partyType: PARTY_TYPES.petitionerSpouse,
          contactPrimary: {
            name: 'Bob',
            address1: '123 Abc Ln',
            countryType: 'domestic',
            city: 'Bobville',
            state: 'AL',
            zip: '12345',
            phone: '1234567890',
            email: 'test@example.com',
          },
          contactSecondary: {
            name: 'Bob',
            address1: '123 Abc Ln',
            countryType: 'domestic',
            city: 'Bobville',
            state: 'AL',
            zip: '12345',
          },
        },
        constants: {
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
