import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCaseOnFormAction } from './setCaseOnFormAction';

describe('setCaseOnFormAction', () => {
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
    const mockContactPrimary = {
      isContactPrimary: true,
      name: 'Pattie the Primary',
    };

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
});
