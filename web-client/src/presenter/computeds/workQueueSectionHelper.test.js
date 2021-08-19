import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';
import { workQueueSectionHelper as workQueueSectionHelperComputed } from './workQueueSectionHelper';

describe('workQueueSectionHelper', () => {
  const workQueueSectionHelper = withAppContextDecorator(
    workQueueSectionHelperComputed,
    applicationContext,
  );

  const JUDGES_CHAMBERS = applicationContext
    .getPersistenceGateway()
    .getJudgesChambers();

  it('returns the expected state when set', () => {
    const { chambersDisplay, sectionDisplay } = runCompute(
      workQueueSectionHelper,
    );

    expect(sectionDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section)).toBe(
      JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label,
    );
    expect(
      chambersDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section),
    ).toBe(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label);
  });

  it('returns the chambers display for section display if the section is a chambers', () => {
    const { chambersDisplay, sectionDisplay } = runCompute(
      workQueueSectionHelper,
    );

    expect(sectionDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section)).toBe(
      JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label,
    );
    expect(
      chambersDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section),
    ).toBe(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label);
  });

  it('returns undefined for sectionDisplay if the section is not a regular section or a chambers', () => {
    const { sectionDisplay } = runCompute(workQueueSectionHelper);

    expect(sectionDisplay('something')).toBeUndefined();
  });
});
