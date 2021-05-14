import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPetitionerCounselFormAction } from './setPetitionerCounselFormAction';

describe('setPetitionerCounselFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('should set the state.form to the associated petitioner counsel via its barNumber', async () => {
    const { state } = await runAction(setPetitionerCounselFormAction, {
      modules: {
        presenter,
      },
      props: {
        barNumber: 'abc',
      },
      state: {
        caseDetail: {
          petitioners: [
            {
              contactId: '123',
              contactType: 'primary',
            },
            {
              contactId: '456',
              contactType: 'secondary',
            },
          ],
          privatePractitioners: [
            {
              barNumber: 'abc',
              representing: ['123', '456'],
            },
          ],
        },
      },
    });
    expect(state.form).toMatchObject({
      barNumber: 'abc',
      filersMap: {
        123: true,
        456: true,
      },
      representing: ['123', '456'],
    });
  });
});
