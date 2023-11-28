import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSelectedConsolidatedCasesToMultiDocketOnAction } from './setSelectedConsolidatedCasesToMultiDocketOnAction';

describe('setSelectedConsolidatedCasesToMultiDocketOnAction', () => {
  it('should set state.setSelectedConsolidatedCasesToMultiDocketOn to true', async () => {
    const { state } = await runAction(
      setSelectedConsolidatedCasesToMultiDocketOnAction(true),
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          setSelectedConsolidatedCasesToMultiDocketOn: false,
        },
      },
    );

    expect(state.setSelectedConsolidatedCasesToMultiDocketOn).toEqual(true);
  });

  it('should set state.setSelectedConsolidatedCasesToMultiDocketOn to false', async () => {
    const { state } = await runAction(
      setSelectedConsolidatedCasesToMultiDocketOnAction(false),
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          setSelectedConsolidatedCasesToMultiDocketOn: true,
        },
      },
    );

    expect(state.setSelectedConsolidatedCasesToMultiDocketOn).toEqual(false);
  });
});
