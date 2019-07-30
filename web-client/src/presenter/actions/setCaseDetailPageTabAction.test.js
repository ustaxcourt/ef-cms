import { runAction } from 'cerebral/test';
import { setCaseDetailPageTabAction } from './setCaseDetailPageTabAction';

describe('setDefaultDocumentDetailTab', () => {
  it('sets state.caseDetailPage.informationTab to the passed in props.tab', async () => {
    const { state } = await runAction(setCaseDetailPageTabAction, {
      props: {
        tab: 'DocketRecord',
      },
    });
    expect(state.caseDetailPage.informationTab).toEqual('DocketRecord');
  });
});
