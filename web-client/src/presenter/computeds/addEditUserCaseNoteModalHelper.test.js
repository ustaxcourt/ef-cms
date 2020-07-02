import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { addEditUserCaseNoteModalHelper as addEditUserCaseNoteModalHelperComputed } from './addEditUserCaseNoteModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser;

const addEditUserCaseNoteModalHelper = withAppContextDecorator(
  addEditUserCaseNoteModalHelperComputed,
  {
    getConstants: () => ({
      USER_ROLES: ROLES,
    }),
    getCurrentUser: () => currentUser,
  },
);

describe('addEditUserCaseNoteModalHelper', () => {
  it("should return Judge's notes as notesLabel if current user is not a trial clerk", () => {
    currentUser = {
      role: ROLES.judge,
    };

    const result = runCompute(addEditUserCaseNoteModalHelper, {});

    expect(result.notesLabel).toEqual("Judge's notes");
  });

  it('should return Notes as notesLabel if current user is a trial clerk', () => {
    currentUser = {
      role: ROLES.trialClerk,
    };

    const result = runCompute(addEditUserCaseNoteModalHelper, {});

    expect(result.notesLabel).toEqual('Notes');
  });
});
