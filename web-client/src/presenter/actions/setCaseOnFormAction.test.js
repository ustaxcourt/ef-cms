import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCaseOnFormAction } from './setCaseOnFormAction';

describe('setCaseOnFormAction', () => {
  const mockContactPrimary = {
    contactType: CONTACT_TYPES.primary,
    name: 'Pattie the Primary',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets caseDetail on state.form from props', async () => {
    const { state } = await runAction(setCaseOnFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(state.form).toEqual({
      docketNumber: '123-45',
    });
  });

  it('should set state.form.contactPrimary from the props.caseDetail.petitioners array', async () => {
    const { state } = await runAction(setCaseOnFormAction, {
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

    const { state } = await runAction(setCaseOnFormAction, {
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
    const { state } = await runAction(setCaseOnFormAction, {
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
});
