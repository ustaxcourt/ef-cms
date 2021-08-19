import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getContactPrimary } from '../../../../shared/src/business/entities/cases/Case';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSelectedPetitionerAddressAction } from './setSelectedPetitionerAddressAction';

describe('setSelectedPetitionerAddressAction', () => {
  const mockContactId = '4aa507b0-dbc7-42f1-bc95-15a4fc43b9bc';
  presenter.providers.applicationContext = applicationContext;

  it('should populate the selected petitioner`s address from case on the form', async () => {
    const result = await runAction(setSelectedPetitionerAddressAction, {
      modules: {
        presenter,
      },
      props: {
        contactId: mockContactId,
      },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          petitioners: [
            {
              ...getContactPrimary(MOCK_CASE),
              address2: 'Space',
              address3: 'Milky Way',
              contactId: mockContactId,
              country: 'USA',
            },
          ],
        },
      },
    });

    expect(result.state.form.contact).toEqual({
      address1: '123 Main St',
      address2: 'Space',
      address3: 'Milky Way',
      city: 'Somewhere',
      country: 'USA',
      countryType: 'domestic',
      postalCode: '12345',
      state: 'TN',
    });
  });
});
