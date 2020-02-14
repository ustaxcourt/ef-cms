import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

import { addEditUserCaseNoteModalHelper as addEditUserCaseNoteModalHelperComputed } from './addEditUserCaseNoteModalHelper';

let currentUser;

const addEditUserCaseNoteModalHelper = withAppContextDecorator(
  addEditUserCaseNoteModalHelperComputed,
  {
    getConstants: () => ({
      USER_ROLES: User.ROLES,
    }),
    getCurrentUser: () => currentUser,
  },
);

describe('addEditUserCaseNoteModalHelper', () => {
  it("should return Judge's notes as notesLabel if current user is not a trial clerk", () => {
    currentUser = {
      role: User.ROLES.judge,
    };

    const result = runCompute(addEditUserCaseNoteModalHelper, {});

    expect(result.notesLabel).toEqual("Judge's notes");
  });

  it('should return Notes as notesLabel if current user is a trial clerk', () => {
    currentUser = {
      role: User.ROLES.trialClerk,
    };

    const result = runCompute(addEditUserCaseNoteModalHelper, {});

    expect(result.notesLabel).toEqual('Notes');
  });
});
