import { runAction } from 'cerebral/test';
import { setFormContactSecondaryAddressAction } from './setFormContactSecondaryAddressAction';

describe('setFormContactSecondaryAddressAction', () => {
  it('sets form.contactSecondary to the contact prop except for the name', async () => {
    const result = await runAction(setFormContactSecondaryAddressAction, {
      props: {
        contact: {
          city: 'Flavortown',
          name: 'Guy Fieri',
        },
      },
      state: {
        form: {
          contactPrimary: {
            city: 'Flavortown',
            name: 'Guy Fieri',
          },
          contactSecondary: {
            city: 'Greenbough',
            inCareOf: 'Jennay',
            name: 'Forrest',
          },
        },
      },
    });

    expect(result.state.form.contactPrimary).toMatchObject({
      city: 'Flavortown',
      name: 'Guy Fieri',
    });
    expect(result.state.form.contactSecondary).toMatchObject({
      city: 'Flavortown',
      inCareOf: 'Jennay',
      name: 'Forrest',
    });
  });
});
