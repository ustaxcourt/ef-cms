import { runAction } from 'cerebral/test';
import { setCaseDetailPageTabAction } from './setCaseDetailPageTabAction';

describe('setDefaultDocumentDetailTab', () => {
  it('sets state.caseDetailPage.primaryTab to the passed in props.tab', async () => {
    const { state } = await runAction(setCaseDetailPageTabAction, {
      props: {
        tab: 'DocketRecord',
      },
    });
    expect(state.caseDetailPage.primaryTab).toEqual('DocketRecord');
  });

  it('sets state.caseDetailPage.primaryTab to caseInformation and state.caseDetailPage.caseInformationTab to the passed in props.tab if isSecondary is true', async () => {
    const { state } = await runAction(setCaseDetailPageTabAction, {
      props: {
        isSecondary: true,
        tab: 'overview',
      },
    });
    expect(state.caseDetailPage.primaryTab).toEqual('caseInformation');
    expect(state.caseDetailPage.caseInformationTab).toEqual('overview');
  });
});
