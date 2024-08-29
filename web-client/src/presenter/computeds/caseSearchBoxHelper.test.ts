import { applicationContext } from '../../applicationContext';
import { caseSearchBoxHelper as caseSearchBoxHelperComputed } from './caseSearchBoxHelper';
import {
  irsPractitionerUser,
  irsSuperuserUser,
  petitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseSearchBoxHelper = withAppContextDecorator(
  caseSearchBoxHelperComputed,
  applicationContext,
);

describe('caseSearchBoxHelper', () => {
  it('should return showSearchDescription true if the user role is not irsSuperuser', () => {
    const result = runCompute(caseSearchBoxHelper, {
      state: { user: irsPractitionerUser },
    });

    expect(result.showSearchDescription).toBe(true);
  });

  it('should return showSearchDescription false if the user role is irsSuperuser', () => {
    const result = runCompute(caseSearchBoxHelper, {
      state: { user: irsSuperuserUser },
    });

    expect(result.showSearchDescription).toBe(false);
  });

  it('should return showSearchDescription false if the user role is petitioner', () => {
    const result = runCompute(caseSearchBoxHelper, {
      state: { user: petitionerUser },
    });

    expect(result.showSearchDescription).toBe(false);
  });

  it('should return showAdvancedSearch true if the user role is not petitioner', () => {
    const result = runCompute(caseSearchBoxHelper, {
      state: { user: irsPractitionerUser },
    });

    expect(result.showAdvancedSearch).toBe(true);
  });

  it('should return showAdvancedSearch false if the user role is petitioner', () => {
    const result = runCompute(caseSearchBoxHelper, {
      state: { user: petitionerUser },
    });

    expect(result.showAdvancedSearch).toBe(false);
  });
});
