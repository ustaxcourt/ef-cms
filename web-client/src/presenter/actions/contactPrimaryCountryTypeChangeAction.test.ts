import { contactPrimaryCountryTypeChangeAction } from './contactPrimaryCountryTypeChangeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('contactPrimaryCountryTypeChangeAction', () => {
  it('should clear contact info and validationErrors when changed', async () => {
    const result = await runAction(contactPrimaryCountryTypeChangeAction, {
      state: {
        form: {
          contactPrimary: {
            address1: '123 Hello',
            city: 'Howdy Town',
            country: 'Argentina',
            phone: '1234567890',
            postalCode: '12345',
            state: '',
          },
        },
        validationErrors: {
          contactPrimary: {
            state: 'Invalid state',
          },
        },
      },
    });

    expect(result.state.validationErrors.contactPrimary).toEqual({});
    expect(result.state.form.contactPrimary.address1).toBeUndefined();
    expect(result.state.form.contactPrimary.city).toBeUndefined();
    expect(result.state.form.contactPrimary.country).toBeUndefined();
    expect(result.state.form.contactPrimary.phone).toBeUndefined();
    expect(result.state.form.contactPrimary.postalCode).toBeUndefined();
    expect(result.state.form.contactPrimary.state).toBeUndefined();
  });
});
