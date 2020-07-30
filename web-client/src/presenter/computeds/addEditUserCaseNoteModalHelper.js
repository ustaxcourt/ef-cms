export const addEditUserCaseNoteModalHelper = (get, applicationContext) => {
  const currentUser = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  const notesLabel =
    currentUser.role === USER_ROLES.trialClerk ? 'Notes' : 'Judge’s notes';

  return {
    notesLabel,
  };
};
