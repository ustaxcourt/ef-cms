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
          contactSecondary: {
            careOf: 'Jennay',
            city: 'Greenbough',
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
      careOf: 'Jennay',
      city: 'Flavortown',
      name: 'Forrest',
    });
  });
});
