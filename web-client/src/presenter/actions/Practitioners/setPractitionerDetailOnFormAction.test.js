import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
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
          admissionsDate: '2019-03-01T04:00:00.000Z',
          firstName: 'Chandler',
          lastName: 'Bing',
        },
      },
      state: { form: {} },
    });
    expect(result.state.form).toEqual({
      admissionsDate: '2019-03-01T04:00:00.000Z',
      day: '1',
      firstName: 'Chandler',
      lastName: 'Bing',
      month: '3',
      year: '2019',
    });
  });
});
