import { runCompute } from 'cerebral/test';

import { workQueueSectionHelper } from './workQueueSectionHelper';

describe('workQueueSectionHelper', () => {
  it('returns the expected state when set', async () => {
    const { chambersDisplay, sectionDisplay } = await runCompute(
      workQueueSectionHelper,
    );
    expect(sectionDisplay('clerkofcourt')).toBe('Clerk of the Court');
    expect(chambersDisplay('urdasChambers')).toBe("Urda's Chambers");
  });
});
