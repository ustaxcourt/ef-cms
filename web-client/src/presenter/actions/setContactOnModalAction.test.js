import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setContactOnModalAction } from './setContactOnModalAction';

describe('setContactOnModalAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.form.contactPrimary from the props.caseDetail.petitioners array', async () => {
    const { state } = await runAction(setContactOnModalAction, {
      modules: { presenter },
      props: {
        privatePractitioner: {
          barNumber: 'abc',
        },
      },
    });

    expect(state.modal.contact).toEqual({
      barNumber: 'abc',
    });
  });
});
