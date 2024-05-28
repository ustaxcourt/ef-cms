import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultContactStateAction } from '@web-client/presenter/actions/StartCase/setDefaultContactStateAction';

describe('setDefaultContactStateAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state correctly when key is included in TYPES', async () => {
    const { state } = await runAction(setDefaultContactStateAction, {
      modules: { presenter },
      props: {
        key: 'filingType',
      },
      state: {
        form: {
          contactPrimary: undefined,
          contactSecondary: {},
          hasSpouseConsent: true,
          isSpouseDeceased: true,
          useSameAsPrimary: true,
        },
      },
    });
    expect(state.form).toEqual({
      contactPrimary: {
        countryType: 'domestic',
      },
    });
  });

  it('should set state correctly when we need to show contact secondary', async () => {
    const { state } = await runAction(setDefaultContactStateAction, {
      modules: { presenter },
      props: {
        key: 'isSpouseDeceased',
        value: 'Yes',
      },
      state: {
        form: {
          contactSecondary: undefined,
          hasSpouseConsent: undefined,
          partyType: PARTY_TYPES.petitionerDeceasedSpouse,
          useSameAsPrimary: undefined,
        },
      },
    });
    expect(state.form).toEqual({
      contactSecondary: {},
      hasSpouseConsent: false,
      partyType: 'Petitioner & deceased spouse',
      useSameAsPrimary: true,
    });
  });

  it('should set state correctly when we do not need to show contact secondary', async () => {
    const { state } = await runAction(setDefaultContactStateAction, {
      modules: { presenter },
      props: {
        key: 'isSpouseDeceased',
        value: 'Yes',
      },
      state: {
        form: {
          contactSecondary: undefined,
          hasSpouseConsent: undefined,
          partyType: 'RANDOM PARTY TYPE',
          useSameAsPrimary: undefined,
        },
      },
    });
    expect(state.form).toEqual({
      contactSecondary: {},
      hasSpouseConsent: false,
      partyType: 'RANDOM PARTY TYPE',
      useSameAsPrimary: false,
    });
  });
});
