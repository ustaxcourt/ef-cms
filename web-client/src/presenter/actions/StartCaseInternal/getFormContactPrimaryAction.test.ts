import { getFormContactPrimaryAction } from './getFormContactPrimaryAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFormContactPrimaryAction', () => {
  it('should return primary contact as a prop from the state', async () => {
    const result = await runAction(getFormContactPrimaryAction, {
      state: {
        form: {
          contactPrimary: {
            city: 'Flavortown',
            name: 'Guy Fieri',
          },
        },
      },
    });

    expect(result.output).toMatchObject({
      contact: {
        city: 'Flavortown',
        name: 'Guy Fieri',
      },
    });
  });
});
