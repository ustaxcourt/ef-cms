import {
  CASE_STATUS_TYPES,
  CaseStatus,
  ProcedureType,
} from '@shared/business/entities/EntityConstants';
import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { addCaseToGroup } from 'cypress/helpers/caseDetail/add-case-to-group';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';

export function createAndServeConsolidatedGroup(
  {
    caseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial,
    judge = '',
    procedureType = undefined,
    trialLocation = undefined,
    includeApwDocument = undefined,
  }: Partial<{
    includeApwDocument: boolean;
    caseStatus: CaseStatus;
    judge: string;
    procedureType: ProcedureType;
    trialLocation: string;
  }> = {
    includeApwDocument: undefined,
    caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    judge: '',
    procedureType: undefined,
    trialLocation: undefined,
  },
): Cypress.Chainable<{
  leadDocketNumber: string;
  memberDocketNumber: string;
}> {
  return createAndServePaperPetition({
    yearReceived: '2019',
    includeApwDocument,
    procedureType,
    trialLocation,
  }).then(({ docketNumber: leadDocketNumber }) => {
    loginAsDocketClerk1();
    goToCase(leadDocketNumber);
    updateCaseStatus(caseStatus, judge);

    return createAndServePaperPetition({
      yearReceived: '2023',
      includeApwDocument,
      procedureType,
      trialLocation,
    }).then(({ docketNumber: memberDocketNumber }) => {
      loginAsDocketClerk1();
      goToCase(memberDocketNumber);
      updateCaseStatus(caseStatus);
      addCaseToGroup(leadDocketNumber);
      return cy.wrap({
        leadDocketNumber,
        memberDocketNumber,
      });
    });
  });
}
