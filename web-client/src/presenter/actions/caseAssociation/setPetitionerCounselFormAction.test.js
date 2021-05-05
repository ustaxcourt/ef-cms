import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPetitionerCounselFormAction } from './setPetitionerCounselFormAction';

describe('setPetitionerCounselFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('should call the delete use case for each respondent on the form with removeFromCase set to true and call the path.success when finished', async () => {
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
      representing: ['123', '456'],
      representingPrimary: true,
      representingSecondary: true,
    });
  });
});
