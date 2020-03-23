import { runAction } from 'cerebral/test';
import { setCaseDetailPageTabAction } from './setCaseDetailPageTabAction';

describe('setDefaultDocumentDetailTab', () => {
  it('sets state.currentViewMetadata.caseDetail.primaryTab to the passed in props.tab', async () => {
    const { state } = await runAction(setCaseDetailPageTabAction, {
      props: {
        tab: 'DocketRecord',
      },
    });
    expect(state.currentViewMetadata.caseDetail.primaryTab).toEqual(
      'DocketRecord',
    );
  });

  it('sets state.currentViewMetadata.caseDetail.primaryTab to caseInformation and state.currentViewMetadata.caseDetail.caseInformationTab to the passed in props.tab if isSecondary is true', async () => {
    const { state } = await runAction(setCaseDetailPageTabAction, {
      props: {
        isSecondary: true,
        tab: 'overview',
      },
    });
    expect(state.currentViewMetadata.caseDetail.primaryTab).toEqual(
      'caseInformation',
    );
    expect(state.currentViewMetadata.caseDetail.caseInformationTab).toEqual(
      'overview',
    );
  });
});
