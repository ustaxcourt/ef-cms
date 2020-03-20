import { runAction } from 'cerebral/test';
import { setDefaultCaseDetailTabAction } from './setDefaultCaseDetailTabAction';

describe('setDefaultCaseDetailTabAction', () => {
  it('should set the default values for caseDetail view tabs', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction);

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'overview',
      inProgressTab: 'draftDocuments',
      primaryTab: 'docketRecord',
    });
  });

  it('should set the primaryTab to passed in prop value', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      props: {
        primaryTab: 'caseInformation',
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'overview',
      inProgressTab: 'draftDocuments',
      primaryTab: 'caseInformation',
    });
  });

  it('should not set anything if currentViewMetadata.caseDetail.frozen is true', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      props: {
        primaryTab: 'caseInformation',
      },
      state: {
        currentViewMetadata: {
          caseDetail: {
            caseInformationTab: 'petitioner',
            frozen: true,
            inProgressTab: 'messages',
            primaryTab: 'caseInformation',
          },
        },
      },
    });

    expect(state.currentViewMetadata.caseDetail).toMatchObject({
      caseInformationTab: 'petitioner',
      frozen: true,
      inProgressTab: 'messages',
      primaryTab: 'caseInformation',
    });
  });
});
