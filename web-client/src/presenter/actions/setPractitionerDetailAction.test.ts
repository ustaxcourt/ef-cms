import { runAction } from '@web-client/presenter/test.cerebral';
import { setPractitionerDetailAction } from './setPractitionerDetailAction';

describe('setPractitionerDetailAction', () => {
  it('sets state.practitionerDetail from props', async () => {
    const result = await runAction(setPractitionerDetailAction, {
      props: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
      },
      state: {
        practitionerDetail: {},
      },
    });

    expect(result.state.practitionerDetail).toEqual({
      barNumber: 'PD1234',
    });
  });
});
