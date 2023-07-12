import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCorrespondenceIdToDisplayAction } from './setCorrespondenceIdToDisplayAction';

describe('setCorrespondenceIdToDisplayAction', () => {
  it('should set state.correspondenceDocumentId to the value passed in props', async () => {
    const mockCorrespondenceId = '123';

    const result = await runAction(setCorrespondenceIdToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        correspondenceId: mockCorrespondenceId,
      },
      state: {},
    });

    expect(result.state.correspondenceId).toBe(mockCorrespondenceId);
  });
});
