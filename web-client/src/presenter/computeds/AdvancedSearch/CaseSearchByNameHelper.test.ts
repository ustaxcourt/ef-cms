import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseSearchByNameHelper as caseSearchByNameHelperComputed } from '@web-client/presenter/computeds/AdvancedSearch/CaseSearchByNameHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('caseSearchByNameHelper', () => {
  const caseSearchByNameHelper = withAppContextDecorator(
    caseSearchByNameHelperComputed,
    applicationContext,
  );

  it('returns appropriate defaults if permissions are not defined in state', () => {
    const TEST_DATE = 'TEST_DATE';
    applicationContext.getUtilities().formatNow = () => TEST_DATE;

    const result = runCompute(caseSearchByNameHelper, {} as any);

    expect(result).toEqual({
      today: 'TEST_DATE',
    });
  });
});
