import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseSearchBoxHelper as caseSearchBoxHelperComputed } from './caseSearchBoxHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseSearchBoxHelper = withAppContextDecorator(
  caseSearchBoxHelperComputed,
  applicationContext,
);

describe('caseSearchBoxHelper', () => {
  it('should return showSearchDescription true if the user role is not irsSuperuser', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchBoxHelper, {
      state: {},
    });

    expect(result.showSearchDescription).toBeTruthy();
  });

  it('should return showSearchDescription false if the user role is irsSuperuser', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsSuperuser,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchBoxHelper, {
      state: {},
    });

    expect(result.showSearchDescription).toBeFalsy();
  });
});
