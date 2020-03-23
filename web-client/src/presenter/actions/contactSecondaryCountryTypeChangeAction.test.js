import { contactSecondaryCountryTypeChangeAction } from './contactSecondaryCountryTypeChangeAction';
import { runAction } from 'cerebral/test';

describe('contactSecondaryCountryTypeChangeAction', () => {
  it('should clear contact info and validationErrors when changed', async () => {
    const result = await runAction(contactSecondaryCountryTypeChangeAction, {
      state: {
        form: {
          contactSecondary: {
            address1: '123 Hello',
            city: 'Howdy Town',
            country: 'Argentina',
            phone: '1234567890',
            postalCode: '12345',
            state: '',
          },
        },
        validationErrors: {
          contactSecondary: {
            state: 'Invalid state',
          },
        },
      },
    });

    expect(result.state.validationErrors.contactSecondary).toEqual({});
    expect(result.state.form.contactSecondary.address1).toBeUndefined();
    expect(result.state.form.contactSecondary.city).toBeUndefined();
    expect(result.state.form.contactSecondary.country).toBeUndefined();
    expect(result.state.form.contactSecondary.phone).toBeUndefined();
    expect(result.state.form.contactSecondary.postalCode).toBeUndefined();
    expect(result.state.form.contactSecondary.state).toBeUndefined();
  });
});
