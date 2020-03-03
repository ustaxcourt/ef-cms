import { runAction } from 'cerebral/test';
import { setCaseCaptionForCaseInfoTabAction } from './setCaseCaptionForCaseInfoTabAction';

describe('setCaseCaptionForCaseInfoTabAction', () => {
  it('should set state.form.caseCaption to the passed in props.caseCaption if the tab is partyInfo', async () => {
    const result = await runAction(setCaseCaptionForCaseInfoTabAction, {
      props: {
        caseCaption: 'something something',
        tab: 'partyInfo',
      },
    });

    expect(result.state.caseDetail.caseCaption).toEqual('something something');
  });

  it('should not set state.caseDetail.caseCaption to the passed in props.caseCaption if the tab is not partyInfo', async () => {
    const result = await runAction(setCaseCaptionForCaseInfoTabAction, {
      props: {
        caseCaption: 'something something',
        tab: 'parties',
      },
    });

    expect(result.state.caseDetail).toBeUndefined();
  });
});
