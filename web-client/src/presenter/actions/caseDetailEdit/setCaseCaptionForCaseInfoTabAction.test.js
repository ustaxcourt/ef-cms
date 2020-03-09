import { runAction } from 'cerebral/test';
import { setCaseCaptionForCaseInfoTabAction } from './setCaseCaptionForCaseInfoTabAction';

describe('setCaseCaptionForCaseInfoTabAction', () => {
  it('should set state.form.caseCaption to the passed in props.caseCaption', async () => {
    const result = await runAction(setCaseCaptionForCaseInfoTabAction, {
      props: {
        caseCaption: 'something something',
      },
    });

    expect(result.state.caseDetail.caseCaption).toEqual('something something');
  });
});
