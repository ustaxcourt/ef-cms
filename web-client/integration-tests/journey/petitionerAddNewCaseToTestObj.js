import { getPetitionWorkItemForCase } from '../helpers';

export const petitionerAddNewCaseToTestObj = (cerebralTest, createdCases) => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', () => {
    const petitionerNewCase = cerebralTest.getState('caseDetail');
    expect(petitionerNewCase).toBeDefined();

    const workitem = getPetitionWorkItemForCase(petitionerNewCase);

    expect(workitem).toBeDefined();
    createdCases.push(petitionerNewCase);
  });
};
