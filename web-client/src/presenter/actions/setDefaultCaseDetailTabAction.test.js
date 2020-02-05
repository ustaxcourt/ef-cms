import { runAction } from 'cerebral/test';
import { setDefaultCaseDetailTabAction } from './setDefaultCaseDetailTabAction';

describe('setDefaultCaseDetailTabAction', () => {
  it('should set the default values for caseDetailPage tabs', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction);

    expect(state.caseDetailPage).toMatchObject({
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

    expect(state.caseDetailPage).toMatchObject({
      caseInformationTab: 'overview',
      inProgressTab: 'draftDocuments',
      primaryTab: 'caseInformation',
    });
  });

  it('should not set anything if caseDetailPage.frozen is true', async () => {
    const { state } = await runAction(setDefaultCaseDetailTabAction, {
      props: {
        primaryTab: 'caseInformation',
      },
      state: {
        caseDetailPage: {
          caseInformationTab: 'petitioner',
          frozen: true,
          inProgressTab: 'messages',
          primaryTab: 'caseInformation',
        },
      },
    });

    expect(state.caseDetailPage).toMatchObject({
      caseInformationTab: 'petitioner',
      frozen: true,
      inProgressTab: 'messages',
      primaryTab: 'caseInformation',
    });
  });
});
