import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupPetitionerContactInformationFormAction } from './setupPetitionerContactInformationFormAction';

describe('setupPetitionerContactInformationFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call applicationContext.getUtilities().setServiceIndicatorsForCase with state.caseDetail', async () => {
    const mockCaseDetail = {
      petitioners: [{ name: 'A Test Petitioner' }],
      privatePractitioners: [],
    };
    await runAction(setupPetitionerContactInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockCaseDetail,
      },
    });

    expect(
      applicationContext.getUtilities().setServiceIndicatorsForCase,
    ).toHaveBeenCalledWith(mockCaseDetail);
  });

  it('should set contact on state.form from the result of setServiceIndicatorsForCase', async () => {
    const mockContactId = '12345A';
    const mockContactPrimary = {
      contactId: mockContactId,
      contactType: CONTACT_TYPES.primary,
      email: 'test@example.com',
      name: 'Test Primary',
    };

    applicationContext
      .getUtilities()
      .setServiceIndicatorsForCase.mockReturnValue({
        petitioners: [
          {
            ...mockContactPrimary,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
        ],
      });

    const { state } = await runAction(
      setupPetitionerContactInformationFormAction,
      {
        modules: {
          presenter,
        },
        props: {
          contactId: mockContactId,
        },
        state: {},
      },
    );

    expect(state.form.contact).toEqual({
      ...mockContactPrimary,
      currentEmail: mockContactPrimary.email,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });
});
