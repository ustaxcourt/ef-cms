import { runAction } from 'cerebral/test';
import { setInternalCaseCaptionAction } from './setInternalCaseCaptionAction';

describe('setInternalCaseCaptionAction', () => {
  it('should set state.form.caseCaption to the passed in props.caseCaption', async () => {
    const result = await runAction(setInternalCaseCaptionAction, {
      props: {
        caseCaption: 'something something',
      },
    });

    expect(result.state.form.caseCaption).toEqual('something something');
  });
});
