import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseDetailPageTabActionGenerator } from './setCaseDetailPageTabActionGenerator';

describe('setDefaultDocumentDetailTab', () => {
  it('sets state.currentViewMetadata.caseDetail.primaryTab to the passed in props.tab', async () => {
    const { state } = await runAction(setCaseDetailPageTabActionGenerator(), {
      props: {
        tab: 'DocketRecord',
      },
    });
    expect(state.currentViewMetadata.caseDetail.primaryTab).toEqual(
      'DocketRecord',
    );
  });

  it('sets state.currentViewMetadata.caseDetail.primaryTab to caseInformation and state.currentViewMetadata.caseDetail.caseInformationTab to the passed in props.tab if isSecondary is true', async () => {
    const { state } = await runAction(setCaseDetailPageTabActionGenerator(), {
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

  it('sets state.currentViewMetadata.caseDetail.primaryTab to the passed in parameter value if isSecondary is true', async () => {
    const { state } = await runAction(
      setCaseDetailPageTabActionGenerator('correspondence'),
      {
        props: {},
      },
    );
    expect(state.currentViewMetadata.caseDetail.primaryTab).toEqual(
      'correspondence',
    );
  });
});
