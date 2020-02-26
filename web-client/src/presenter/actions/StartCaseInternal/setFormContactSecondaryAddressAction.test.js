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
        form: { contactSecondary: { city: 'Greenbough', name: 'Forrest' } },
      },
    });

    expect(result.state.form.contactSecondary).toMatchObject({
      city: 'Flavortown',
      name: 'Forrest',
    });
  });
});
