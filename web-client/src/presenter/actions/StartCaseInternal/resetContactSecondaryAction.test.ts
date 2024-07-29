import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { resetContactSecondaryAction } from '@web-client/presenter/actions/StartCaseInternal/resetContactSecondaryAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetContactSecondaryAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state correctly when "hasSpouseConsent" is true', async () => {
    const results = await runAction(resetContactSecondaryAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'hasSpouseConsent',
        value: true,
      },
      state: {
        form: {
          contactSecondary: undefined,
          useSameAsPrimary: undefined,
        },
      },
    });

    const { contactSecondary, useSameAsPrimary } = results.state.form;
    expect(contactSecondary).toEqual({});
    expect(useSameAsPrimary).toEqual(true);
  });

  it('should set state correctly when "hasSpouseConsent" is false', async () => {
    const results = await runAction(resetContactSecondaryAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'hasSpouseConsent',
        value: false,
      },
      state: {
        form: {
          contactSecondary: undefined,
          useSameAsPrimary: undefined,
        },
      },
    });

    const { contactSecondary, useSameAsPrimary } = results.state.form;
    expect(contactSecondary).toEqual({});
    expect(useSameAsPrimary).toEqual(false);
  });

  it('should set state correctly when "useSameAsPrimary" is true', async () => {
    const results = await runAction(resetContactSecondaryAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'useSameAsPrimary',
        value: true,
      },
      state: {
        form: {
          contactSecondary: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            city: 'city',
            country: 'country',
            countryType: 'countryType',
            postalCode: 'postalCode',
            state: 'state',
          },
          useSameAsPrimary: undefined,
        },
      },
    });

    const { contactSecondary, useSameAsPrimary } = results.state.form;
    expect(useSameAsPrimary).toEqual(true);
    expect(contactSecondary).toEqual({});
  });

  it('should set state correctly when "useSameAsPrimary" is false', async () => {
    const results = await runAction(resetContactSecondaryAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'useSameAsPrimary',
        value: false,
      },
      state: {
        form: {
          contactSecondary: {
            countryType: 'RANDOM_COUNTRY_TYPE',
          },
          useSameAsPrimary: undefined,
        },
      },
    });

    const { contactSecondary, useSameAsPrimary } = results.state.form;
    expect(useSameAsPrimary).toEqual(false);
    expect(contactSecondary).toEqual({
      countryType: 'domestic',
    });
  });
});
