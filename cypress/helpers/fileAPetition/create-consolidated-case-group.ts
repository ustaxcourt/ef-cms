import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { addCaseToGroup } from 'cypress/helpers/caseDetail/add-case-to-group';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';

export function createAndServeConsolidatedGroup() {
  createAndServePaperPetition().then(({ docketNumber: childDocketNumber }) => {
    loginAsDocketClerk1();
    createAndServePaperPetition({ yearReceived: '2019' }).then(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ docketNumber }) => {
        loginAsDocketClerk1();
        addCaseToGroup(childDocketNumber);
      },
    );
  });
}
