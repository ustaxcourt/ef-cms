import { computeDocketEntryIdAction } from './computeDocketEntryIdAction';
import { runAction } from 'cerebral/test';

// todo: fix these!
describe('computeDocketEntryIdAction', () => {
  it('sets state.docketEntryId if blah blah blah', async () => {
    const result = await runAction(computeDocketEntryIdAction, {
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
