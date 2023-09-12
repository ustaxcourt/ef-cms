import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
