import { countryTypeFormContactChangeAction } from './countryTypeFormContactChangeAction';
import { runAction } from 'cerebral/test';

describe('countryTypeFormContactChangeAction', () => {
  it('should clear contact info and validationErrors when changed', async () => {
    const result = await runAction(countryTypeFormContactChangeAction, {
      state: {
        form: {
          contact: {
            address1: '123 Hello',
            city: 'Howdy Town',
            country: 'Argentina',
            phone: '1234567890',
            postalCode: '12345',
            state: '',
          },
        },
        validationErrors: {
          contact: {
            state: 'Invalid state',
          },
        },
      },
    });

    expect(result.state.validationErrors.contact).toEqual({});
    expect(result.state.form.contact.address1).toBeUndefined();
    expect(result.state.form.contact.city).toBeUndefined();
    expect(result.state.form.contact.country).toBeUndefined();
    expect(result.state.form.contact.phone).toBeUndefined();
    expect(result.state.form.contact.postalCode).toBeUndefined();
    expect(result.state.form.contact.state).toBeUndefined();
  });
});
