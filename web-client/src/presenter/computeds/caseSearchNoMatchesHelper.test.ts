import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseSearchNoMatchesHelper as caseSearchNoMatchesHelperComputed } from './caseSearchNoMatchesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseSearchNoMatchesHelper = withAppContextDecorator(
  caseSearchNoMatchesHelperComputed,
  applicationContext,
);

describe('caseSearchNoMatchesHelper', () => {
  it('should return showSearchByNameOption true if the user role is not petitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchNoMatchesHelper, {
      state: {},
    });

    expect(result.showSearchByNameOption).toBe(true);
  });

  it('should return showSearchByNameOption false if the user role is petitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchNoMatchesHelper, {
      state: {},
    });

    expect(result.showSearchByNameOption).toBe(false);
  });
});
