import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';
import { workQueueSectionHelper as workQueueSectionHelperComputed } from './workQueueSectionHelper';

const workQueueSectionHelper = withAppContextDecorator(
  workQueueSectionHelperComputed,
  applicationContext,
);

const {
  CLERK_OF_COURT_SECTION,
  URDAS_CHAMBERS_SECTION,
} = applicationContext.getConstants();

describe('workQueueSectionHelper', () => {
  it('returns the expected state when set', () => {
    const { chambersDisplay, sectionDisplay } = runCompute(
      workQueueSectionHelper,
    );
    expect(sectionDisplay(CLERK_OF_COURT_SECTION)).toBe('Clerk of the Court');
    expect(
      chambersDisplay(URDAS_CHAMBERS_SECTION.ARMENS_CHAMBERS_SECTION.section),
    ).toBe(URDAS_CHAMBERS_SECTION.ARMENS_CHAMBERS_SECTION.label);
  });

  it('returns the chambers display for section display if the section is a chambers', () => {
    const { chambersDisplay, sectionDisplay } = runCompute(
      workQueueSectionHelper,
    );
    expect(
      sectionDisplay(URDAS_CHAMBERS_SECTION.ARMENS_CHAMBERS_SECTION.section),
    ).toBe(URDAS_CHAMBERS_SECTION.ARMENS_CHAMBERS_SECTION.label);
    expect(
      chambersDisplay(URDAS_CHAMBERS_SECTION.ARMENS_CHAMBERS_SECTION.section),
    ).toBe(URDAS_CHAMBERS_SECTION.ARMENS_CHAMBERS_SECTION.label);
  });

  it('returns undefined for sectionDisplay if the section is not a regular section or a chambers', () => {
    const { sectionDisplay } = runCompute(workQueueSectionHelper);
    expect(sectionDisplay('something')).toBeUndefined();
  });
});
