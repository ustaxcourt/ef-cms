import { runAction } from 'cerebral/test';
import { setFormContactSecondaryAction } from './setFormContactSecondaryAction';

describe('setFormContactSecondaryAction', () => {
  it('sets form.contactSecondary to the contact prop', async () => {
    const result = await runAction(setFormContactSecondaryAction, {
      props: {
        contact: {
          city: 'Flavortown',
          name: 'Guy Fieri',
        },
      },
    });

    expect(result.state.form.contactSecondary).toMatchObject({
      city: 'Flavortown',
      name: 'Guy Fieri',
    });
  });
});
