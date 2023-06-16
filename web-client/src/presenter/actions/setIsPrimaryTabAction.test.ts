import { runAction } from '@web-client/presenter/test.cerebral';
import { setIsPrimaryTabAction } from './setIsPrimaryTabAction';

describe('setIsPrimaryTabAction', () => {
  it('sets docketRecord to true and all others to false when the primary tab is docketRecord', async () => {
    const { state } = await runAction(setIsPrimaryTabAction, {
      props: {},
      state: {
        currentViewMetadata: {
          caseDetail: {
            caseDetailInternalTabs: {
              caseInformation: false,
              correspondence: false,
              deadlines: false,
              docketRecord: false,
              inProgress: false,
              notes: false,
            },
            primaryTab: 'docketRecord',
          },
        },
      },
    });

    expect(
      state.currentViewMetadata.caseDetail.caseDetailInternalTabs,
    ).toMatchObject({
      caseInformation: false,
      correspondence: false,
      deadlines: false,
      docketRecord: true,
      inProgress: false,
      notes: false,
    });
  });
});
