import { COUNTRY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetContactSecondaryAddressOnFormAction } from './unsetContactSecondaryAddressOnFormAction';

describe('unsetContactSecondaryAddressOnFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset contact address info on the form', async () => {
    const { state } = await runAction(
      unsetContactSecondaryAddressOnFormAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: {
            contactSecondary: {
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
      },
    );

    expect(state.form.contactSecondary.address1).toBeUndefined();
    expect(state.form.contactSecondary.address2).toBeUndefined();
    expect(state.form.contactSecondary.address3).toBeUndefined();
    expect(state.form.contactSecondary.city).toBeUndefined();
    expect(state.form.contactSecondary.state).toBeUndefined();
    expect(state.form.contactSecondary.postalCode).toBeUndefined();
    expect(state.form.contactSecondary.country).toBeUndefined();
  });

  it('should not unset the default country type', async () => {
    const { state } = await runAction(
      unsetContactSecondaryAddressOnFormAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: {
            contact: {
              countryType: COUNTRY_TYPES.DOMESTIC,
            },
          },
        },
      },
    );

    expect(state.form.contact.countryType).toEqual(COUNTRY_TYPES.DOMESTIC);
  });

  it('should unset state.screenMetadata.petitionerAddresses', async () => {
    const { state } = await runAction(
      unsetContactSecondaryAddressOnFormAction,
      {
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
      },
    );

    expect(state.screenMetadata.petitionerAddresses).toBeUndefined();
  });
});
