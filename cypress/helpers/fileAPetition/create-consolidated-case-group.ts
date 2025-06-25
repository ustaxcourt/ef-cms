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

export type GroupInfoType = {
  leadDocketNumber: string;
  memberDocketNumbers: string[];
};

export function createAndServeConsolidatedGroup({
  caseStatus = CASE_STATUS_TYPES.generalDocketReadyForTrial,
  leadCaseJudge = '',
  memeberCaseJudge = '',
  procedureType = undefined,
  trialLocation = undefined,
  includeApwDocument = undefined,
  numberOfMemberCases = 1,
  leadYearReceived = '2019',
  memberYearReceived = '2023',
}: {
  includeApwDocument?: boolean;
  caseStatus?: CaseStatus;
  leadCaseJudge?: string;
  memeberCaseJudge?: string;
  procedureType?: ProcedureType;
  trialLocation?: string;
  numberOfMemberCases?: number;
  leadYearReceived?: string;
  memberYearReceived?: string;
}): Cypress.Chainable<GroupInfoType> {
  return createAndServePaperPetition({
    yearReceived: leadYearReceived,
    includeApwDocument,
    procedureType,
    trialLocation,
  }).then(({ docketNumber: leadDocketNumber }) => {
    cy.wrap<GroupInfoType>({
      leadDocketNumber,
      memberDocketNumbers: [],
    }).as('CONSOLIDATED_GROUP_INFO');

    loginAsDocketClerk1();
    goToCase(leadDocketNumber);
    updateCaseStatus(caseStatus, leadCaseJudge);

    for (let index = 0; index < numberOfMemberCases; index++) {
      createAndServePaperPetition({
        yearReceived: memberYearReceived,
        includeApwDocument,
        procedureType,
        trialLocation,
      }).then(({ docketNumber: memberDocketNumber }) => {
        loginAsDocketClerk1();
        goToCase(memberDocketNumber);
        updateCaseStatus(caseStatus, memeberCaseJudge);
        addCaseToGroup(leadDocketNumber);

        cy.get<GroupInfoType>('@CONSOLIDATED_GROUP_INFO').then(
          consolidatedGroupInfo => {
            consolidatedGroupInfo.memberDocketNumbers.push(memberDocketNumber);
            cy.wrap<GroupInfoType>(consolidatedGroupInfo).as(
              'CONSOLIDATED_GROUP_INFO',
            );
          },
        );
      });
    }

    return cy.get<GroupInfoType>('@CONSOLIDATED_GROUP_INFO');
  });
}
