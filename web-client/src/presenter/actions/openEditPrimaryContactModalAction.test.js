import { openEditPrimaryContactModalAction } from './openEditPrimaryContactModalAction';
import { runAction } from 'cerebral/test';

describe('openEditPrimaryContactModalAction', () => {
  it('sets state.showModal to EditPrimaryContact', async () => {
    const result = await runAction(openEditPrimaryContactModalAction);

    expect(result.state.showModal).toEqual('EditPrimaryContact');
  });
});
