import { getPetitionWorkItemForCase } from '../helpers';

export const petitionerAddNewCaseToTestObj = (test, createdCases) => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', async () => {
    const petitionerNewCase = test.getState('caseDetail');
    expect(petitionerNewCase).toBeDefined();

    const workitem = getPetitionWorkItemForCase(petitionerNewCase);

    expect(workitem).toBeDefined();
    createdCases.push(petitionerNewCase);
  });
};
