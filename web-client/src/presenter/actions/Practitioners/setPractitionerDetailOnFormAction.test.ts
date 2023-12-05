import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPractitionerDetailOnFormAction } from './setPractitionerDetailOnFormAction';

describe('setPractitionerDetailOnFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('splits the admissionsDate into month, day, and year and sets the practitioner details on the form', async () => {
    const result = await runAction(setPractitionerDetailOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        practitionerDetail: {
          admissionsDate: '2019-03-01',
          firstName: 'Chandler',
          lastName: 'Bing',
        },
      },
      state: { form: {} },
    });
    expect(result.state.form).toEqual({
      admissionsDate: '2019-03-01',
      firstName: 'Chandler',
      lastName: 'Bing',
    });
  });

  it('should set state.form.originalEmail to the value of props.practitionerDetail.email', async () => {
    const mockEmail = 'test@example.com';

    const { state } = await runAction(setPractitionerDetailOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        practitionerDetail: {
          email: mockEmail,
        },
      },
      state: {
        form: {
          originalEmail: undefined,
        },
      },
    });

    expect(state.form.originalEmail).toEqual(mockEmail);
  });
});
