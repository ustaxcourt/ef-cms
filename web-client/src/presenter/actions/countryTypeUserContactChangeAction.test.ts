import { countryTypeUserContactChangeAction } from './countryTypeUserContactChangeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('countryTypeUserContactChangeAction', () => {
  it('unsets address information when the countryType is changed', async () => {
    const result = await runAction(countryTypeUserContactChangeAction, {
      state: {
        user: {
          contact: {
            address1: '123 Sauceboss Ave',
            address2: 'Apt 1',
            address3: 'Yeehaw',
            city: 'Flavortown',
            country: 'United States',
            phone: '123-456-7890',
            postalCode: '12345',
            state: 'AR',
          },
        },
      },
    });

    expect(result.state).toMatchObject({
      user: {
        contact: {},
      },
      validationErrors: {
        contact: {},
      },
    });
  });
});
