import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPetitionerCounselFormAction } from './setPetitionerCounselFormAction';

describe('setPetitionerCounselFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('should set the state.form to the associated petitioner counsel via its barNumber', async () => {
    const mockPrimaryId = '99370a21-3197-49bb-ac1b-2df7f2dca50a';
    const mockSecondaryId = 'e70dce71-d27a-4e21-b065-4e92665748ea';

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
              contactId: mockPrimaryId,
              contactType: 'primary',
            },
            {
              contactId: mockSecondaryId,
              contactType: 'secondary',
            },
          ],
          privatePractitioners: [
            {
              barNumber: 'abc',
              representing: [mockPrimaryId, mockSecondaryId],
            },
          ],
        },
      },
    });
    expect(state.form).toMatchObject({
      barNumber: 'abc',
      representing: [mockPrimaryId, mockSecondaryId],
      representingMap: {
        [mockPrimaryId]: true,
        [mockSecondaryId]: true,
      },
    });
  });
});
