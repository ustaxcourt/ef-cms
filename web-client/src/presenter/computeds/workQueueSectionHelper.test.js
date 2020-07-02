import { runCompute } from 'cerebral/test';
import { workQueueSectionHelper } from './workQueueSectionHelper';

describe('workQueueSectionHelper', () => {
  it('returns the expected state when set', () => {
    const { chambersDisplay, sectionDisplay } = runCompute(
      workQueueSectionHelper,
    );
    expect(sectionDisplay('clerkofcourt')).toBe('Clerk of the Court');
    expect(chambersDisplay('urdasChambers')).toBe('Urda’s Chambers');
  });

  it('returns the chambers display for section display if the section is a chambers', () => {
    const { chambersDisplay, sectionDisplay } = runCompute(
      workQueueSectionHelper,
    );
    expect(sectionDisplay('urdasChambers')).toBe('Urda’s Chambers');
    expect(chambersDisplay('urdasChambers')).toBe('Urda’s Chambers');
  });

  it('returns undefined for sectionDisplay if the section is not a regular section or a chambers', () => {
    const { sectionDisplay } = runCompute(workQueueSectionHelper);
    expect(sectionDisplay('something')).toBeUndefined();
  });
});
