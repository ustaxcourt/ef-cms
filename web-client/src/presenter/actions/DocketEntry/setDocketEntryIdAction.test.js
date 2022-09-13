import { runAction } from 'cerebral/test';
import { setDocketEntryIdAction } from './setDocketEntryIdAction';

// todo: fix these!
describe('setDocketEntryIdAction', () => {
  it('sets state.docketEntryId if blah blah blah', async () => {
    const result = await runAction(setDocketEntryIdAction, {
      state: {
        currentViewMetadata: { documentUploadMode: 'scan' },
        form: {},
      },
    });

    expect(result.state).toMatchObject({
      docketEntryId: 'aslkdfls;kdjflksjdklfjdsklfjsdflks',
    });
  });
});
