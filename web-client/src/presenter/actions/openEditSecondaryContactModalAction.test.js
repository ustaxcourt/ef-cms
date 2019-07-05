import { openEditSecondaryContactModalAction } from './openEditSecondaryContactModalAction';
import { runAction } from 'cerebral/test';

describe('openEditSecondaryContactModalAction', () => {
  it('sets state.showModal to EditSecondaryContact', async () => {
    const result = await runAction(openEditSecondaryContactModalAction);

    expect(result.state.showModal).toEqual('EditSecondaryContact');
  });
});
