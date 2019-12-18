import { presenter } from '../../presenter';
import { removeCaseDetailPendingItemAction } from './removeCaseDetailPendingItemAction';
import { runAction } from 'cerebral/test';

describe('removeCaseDetailPendingItemAction', () => {
  it('should update the props', async () => {
    const result = await runAction(removeCaseDetailPendingItemAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { documents: [{ documentId: '123abc', pending: true }] },
        documentId: '123abc',
      },
      state: {},
    });

    expect(result.output.combinedCaseDetailWithForm.documents).toEqual([
      { documentId: '123abc', pending: false },
    ]);
  });
});
