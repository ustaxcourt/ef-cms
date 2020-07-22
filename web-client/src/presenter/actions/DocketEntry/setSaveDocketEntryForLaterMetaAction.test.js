import { runAction } from 'cerebral/test';
import { setSaveDocketEntryForLaterMetaAction } from './setSaveDocketEntryForLaterMetaAction';

describe('setSaveDocketEntryForLaterMetaAction', () => {
  it('returns prop to not generate a coversheet', async () => {
    const result = await runAction(setSaveDocketEntryForLaterMetaAction);

    expect(result.output).toMatchObject({
      isSavingForLater: true,
      shouldGenerateCoversheet: false,
    });
  });
});
