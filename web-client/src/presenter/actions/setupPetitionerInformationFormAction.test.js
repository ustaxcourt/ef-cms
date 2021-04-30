import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupPetitionerInformationFormAction } from './setupPetitionerInformationFormAction';

describe('setupPetitionerInformationFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call applicationContext.getUtilities().setServiceIndicatorsForCase with state.caseDetail', async () => {
    await runAction(setupPetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { petitioners: [] },
      },
    });

    expect(
      applicationContext.getUtilities().setServiceIndicatorsForCase,
    ).toHaveBeenCalled();
  });

  it('should set contactPrimary, contactSecondary, and partyType on state.form from the result of setServiceIndicatorsForCase', async () => {
    const { PARTY_TYPES } = applicationContext.getConstants();
    const mockContactPrimary = {
      contactType: CONTACT_TYPES.primary,
      name: 'Test Primary',
    };
    const mockContactSecondary = {
      contactType: CONTACT_TYPES.secondary,
      name: 'Test Secondary',
    };
    const mockPartyType = PARTY_TYPES.nextFriendForMinor;

    applicationContext
      .getUtilities()
      .setServiceIndicatorsForCase.mockReturnValue({
        partyType: mockPartyType,
        petitioners: [mockContactPrimary, mockContactSecondary],
      });

    const { state } = await runAction(setupPetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(state.form.contactPrimary).toEqual(mockContactPrimary);
    expect(state.form.contactSecondary).toEqual(mockContactSecondary);
    expect(state.form.partyType).toEqual(mockPartyType);
  });
});
