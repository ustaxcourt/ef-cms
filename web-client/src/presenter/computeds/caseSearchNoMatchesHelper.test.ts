import { applicationContext } from '../../applicationContext';
import { caseSearchNoMatchesHelper as caseSearchNoMatchesHelperComputed } from './caseSearchNoMatchesHelper';
import { irsPractitionerUser, petitionerUser } from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseSearchNoMatchesHelper = withAppContextDecorator(
  caseSearchNoMatchesHelperComputed,
  applicationContext,
);

describe('caseSearchNoMatchesHelper', () => {
  it('should return showSearchByNameOption true if the user role is not petitioner', () => {
    const result = runCompute(caseSearchNoMatchesHelper, {
      state: { user: irsPractitionerUser },
    });

    expect(result.showSearchByNameOption).toBe(true);
  });

  it('should return showSearchByNameOption false if the user role is petitioner', () => {
    const result = runCompute(caseSearchNoMatchesHelper, {
      state: { user: petitionerUser },
    });

    expect(result.showSearchByNameOption).toBe(false);
  });
});
