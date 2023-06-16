import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseSearchBoxHelper as caseSearchBoxHelperComputed } from './caseSearchBoxHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

    expect(result.showSearchDescription).toBe(true);
  });

  it('should return showSearchDescription false if the user role is irsSuperuser', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsSuperuser,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchBoxHelper, {
      state: {},
    });

    expect(result.showSearchDescription).toBe(false);
  });

  it('should return showSearchDescription false if the user role is petitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchBoxHelper, {
      state: {},
    });

    expect(result.showSearchDescription).toBe(false);
  });

  it('should return showAdvancedSearch true if the user role is not petitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchBoxHelper, {
      state: {},
    });

    expect(result.showAdvancedSearch).toBe(true);
  });

  it('should return showAdvancedSearch false if the user role is petitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
      userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
    });

    const result = runCompute(caseSearchBoxHelper, {
      state: {},
    });

    expect(result.showAdvancedSearch).toBe(false);
  });
});
