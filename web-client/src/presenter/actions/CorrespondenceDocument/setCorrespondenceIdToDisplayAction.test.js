import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCorrespondenceIdToDisplayAction } from './setCorrespondenceIdToDisplayAction';

describe('setCorrespondenceIdToDisplayAction', () => {
  it('should set state.correspondenceDocumentId to the value passed in props', async () => {
    const mockCorrespondenceDocumentId = '123';

    const result = await runAction(setCorrespondenceIdToDisplayAction, {
      modules: {
        presenter,
      },
      props: {
        correspondenceId: mockCorrespondenceDocumentId,
      },
      state: {},
    });

    expect(result.state.correspondenceDocumentId).toBe(
      mockCorrespondenceDocumentId,
    );
  });
});
