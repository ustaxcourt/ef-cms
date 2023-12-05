import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setContactsOnFormAction } from './setContactsOnFormAction';

describe('setContactsOnFormAction', () => {
  const mockContactPrimary = {
    contactType: CONTACT_TYPES.primary,
    name: 'Pattie the Primary',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.form.contactPrimary from the props.caseDetail.petitioners array', async () => {
    const { state } = await runAction(setContactsOnFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          docketNumber: '123-45',
          petitioners: [mockContactPrimary],
        },
      },
    });

    expect(state.form.contactPrimary).toEqual(mockContactPrimary);
  });

  it('should set state.form.contactSecondary from the props.caseDetail.petitioners array', async () => {
    const mockContactSecondary = {
      contactType: CONTACT_TYPES.secondary,
      name: 'Sally the Secondary',
    };

    const { state } = await runAction(setContactsOnFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          docketNumber: '123-45',
          petitioners: [mockContactPrimary, mockContactSecondary],
        },
      },
    });

    expect(state.form.contactSecondary).toEqual(mockContactSecondary);
  });

  it('should set state.form.contactSecondary to undefined if the props.caseDetail.petitioners array does not have a secondary contact', async () => {
    const { state } = await runAction(setContactsOnFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          docketNumber: '123-45',
          petitioners: [mockContactPrimary],
        },
      },
    });

    expect(state.form.contactSecondary).toBeUndefined();
  });

  it('should unset state.form.petitioners', async () => {
    const { state } = await runAction(setContactsOnFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {},
      },
      state: {
        form: {
          petitioners: [mockContactPrimary],
        },
      },
    });

    expect(state.form.petitioners).toBeUndefined();
  });
});
