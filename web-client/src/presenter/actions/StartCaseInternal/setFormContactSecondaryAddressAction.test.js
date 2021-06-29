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
            contactId: '123abc',
            name: 'Guy Fieri',
          },
          contactSecondary: {
            city: 'Greenbough',
            contactId: 'abc123',
            inCareOf: 'Jennay',
            name: 'Forrest',
          },
        },
      },
    });

    expect(result.state.form.contactPrimary).toMatchObject({
      city: 'Flavortown',
      contactId: '123abc',
      name: 'Guy Fieri',
    });
    expect(result.state.form.contactSecondary).toMatchObject({
      city: 'Flavortown',
      contactId: 'abc123',
      inCareOf: 'Jennay',
      name: 'Forrest',
    });
  });
});
