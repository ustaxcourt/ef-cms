import { COUNTRY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { unsetAddressOnFormAction } from './unsetAddressOnFormAction';

describe('removeCaseFromTrialAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset contact address info on the form', async () => {
    const { state } = await runAction(unsetAddressOnFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: {
            address1: '1234',
            address2: 'Main street',
            address3: 'Avenue',
            caseCaption: 'This should not be unset',
            city: 'Juneau',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            postalCode: 11111,
            state: 'AK',
          },
        },
      },
    });

    expect(state.form.contact.address1).toBeUndefined();
    expect(state.form.contact.address2).toBeUndefined();
    expect(state.form.contact.address3).toBeUndefined();
    expect(state.form.contact.city).toBeUndefined();
    expect(state.form.contact.state).toBeUndefined();
    expect(state.form.contact.postalCode).toBeUndefined();
    expect(state.form.contact.country).toBeUndefined();
    expect(state.form.contact.countryType).toBeUndefined();
  });

  it('should unset state.screenMetadata.petitionerAddresses', async () => {
    const { state } = await runAction(unsetAddressOnFormAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetada: {
          petitionerAddresses: [
            {
              '4da18170-85ef-4a39-8742-85e97d321895': '123 somewhere lane',
            },
            {
              '4da18170-85ef-4a39-7778-85e97d321895': '123 another lane',
            },
          ],
        },
      },
    });

    expect(state.screenMetadata.petitionerAddresses).toBeUndefined();
  });
});
