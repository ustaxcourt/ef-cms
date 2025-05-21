import { mockEntireFile } from '@shared/test/mockFactory';
mockEntireFile({
  module: '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase',
  keepImplementation: true,
});
import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupPetitionerContactInformationFormAction } from './setupPetitionerContactInformationFormAction';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';

describe('setupPetitionerContactInformationFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call setServiceIndicatorsForCase with state.caseDetail', async () => {
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

    expect(setServiceIndicatorsForPetitionersOnCase).toHaveBeenCalledWith(
      mockCaseDetail,
    );
  });

  it('should set contact on state.form from the result of setServiceIndicatorsForCase', async () => {
    const mockContactId = '12345A';
    const mockContactPrimary = {
      contactId: mockContactId,
      contactType: CONTACT_TYPES.primary,
      email: 'test@example.com',
      name: 'Test Primary',
    };

    (setServiceIndicatorsForPetitionersOnCase as jest.Mock).mockReturnValue({
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
