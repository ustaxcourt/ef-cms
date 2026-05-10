import {
  loginAsTrialClerk,
  loginAsIrsPractitioner,
  loginAsCaseServicesSupervisor,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { getCaseDetailTab } from '../../../support/pages/case-detail';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
import { attachFile } from 'cypress/helpers/file/upload-file';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

type MinuteSheetFixture = {
  docketNumber: string;
  trialSessionId: string;
};

const trialLocation = 'Birmingham, Alabama';

const createCalendaredMinuteSheetFixture =
  (): Cypress.Chainable<MinuteSheetFixture> => {
    return createAndServePaperPetition({ trialLocation }).then(
      ({ docketNumber }) => {
        loginAsIrsPractitioner();
        cy.visit(`case-detail/${docketNumber}`);
        getCaseDetailTab('case-information').click();
        cy.get('[data-testid="button-first-irs-document"]').click();
        selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
        cy.get('button#submit-document').click();

        cy.get('label#primary-document-label').scrollIntoView();
        cy.get('label#primary-document-label').should(
          'not.have.class',
          'validated',
        );
        attachFile({
          filePath: '../../helpers/file/sample.pdf',
          selector: '#primary-document',
          selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
        });
        cy.get('label#primary-document-label').should(
          'have.class',
          'validated',
        );
        cy.get('button#submit-document').click();
        cy.get('label#redaction-acknowledgement-label').click();
        cy.get('button#submit-document').click();
        cy.showsSuccessMessage(true);

        loginAsCaseServicesSupervisor();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        cy.get('#tab-tracked-items').click();
        cy.get('#tab-pending-report').click();
        cy.get('[data-testid^=remove-pending-item-button]').click();
        cy.get('[data-testid=modal-confirm]').click();
        cy.visit('/messages/my/inbox');

        return createTrialSession({ trialLocation }).then(
          ({ trialSessionId }) => {
            cy.visit(`/trial-session-detail/${trialSessionId}`);
            cy.get(`[data-testid=qc-complete-${docketNumber}]`).click({
              force: true,
            });
            cy.get('[data-testid=set-calendar-button]').click();
            cy.get('[data-testid=modal-button-confirm]').click();
            cy.get('[data-testid=printing-complete]').click();

            return cy.wrap({ docketNumber, trialSessionId });
          },
        );
      },
    );
  };

const openMinuteSheet = ({
  docketNumber,
  trialSessionId,
}: MinuteSheetFixture): void => {
  loginAsTrialClerk();
  cy.visit(
    `/trial-session-detail/${trialSessionId}/case/${docketNumber}/minutes`,
  );
  cy.url().should('include', '/minutes');
  cy.get('#judge').contains('Lewis R. Carluzzo');
};

describe('Create a minute sheet, fill out sections of the form, navigate away and return to the form with data intact, and print to PDF', () => {
  it('allows a trial clerk to complete the minute sheet workflow on a fresh calendared case', () => {
    const courtReporter = 'Test Court Reporter';
    const calledNote = 'Called note';
    const notCalledNote = 'Not called note';
    const recalledNote = 'Recalled note';
    const pretrialNote = 'Pretrial note';
    const trialNote = 'Trial note';
    const hearingNote = 'Hearing note';
    const jurisdictionRetainedNote = 'Jurisdiction retained note';
    const continuedNote = 'Continued note';
    const petitionerDatesOfAppearance = '10/10/2021, 11/10/2021';
    const respondentDatesOfAppearance = '02/22, 03/22';
    const firstMotionNote = 'First motion note';
    const secondMotionNote = 'Second motion note';
    const orderNote = 'Order note';
    const decisionNote = 'Decision note';
    const documentDescription = 'Document description';
    const briefNote = 'Brief note';
    const openingNotes = 'Opening notes';
    const answeringNotes = 'Answering notes';
    const replyNotes = 'Reply notes';
    const surReplyNotes = 'Sur-reply notes';
    const firstWitness = 'John Smith';
    const secondWitness = 'Jane Doe';
    const firstExhibitDescription = 'Exhibit A';
    const firstExhibitNote = 'First exhibit note';
    const secondExhibitDescription = 'Exhibit B';
    const secondExhibitNote = 'Second exhibit note';

    createCalendaredMinuteSheetFixture().then(fixture => {
      openMinuteSheet(fixture);

      // Metadata section
      cy.get('#judge').contains('Lewis R. Carluzzo');
      cy.get('#trialClerk').should('have.value', 'Test trialclerk1');

      cy.intercept('PUT', '**/trial-sessions/minutes').as('autosaveMinutes');
      cy.get('#remoteSession').check({ force: true });
      cy.get('#courtReporter').should('have.value', '');
      cy.get('#courtReporter').clear();
      cy.get('#courtReporter').type(courtReporter);
      cy.get('#courtReporter').blur();
      cy.get('#courtReporter').should('have.value', courtReporter);
      cy.get('#remoteSession').should('be.checked');
      cy.wait('@autosaveMinutes').its('response.statusCode').should('eq', 200);

      // CaseMetadata section
      cy.get('[data-testid="calledDate"]').type('2/21/2024');
      cy.get('[data-testid="calledNote"]').type(calledNote);
      cy.get('[data-testid="calledTranscriptOrdered"]').check({ force: true });
      cy.get('#calledNote').should('have.value', calledNote);
      cy.get('#calledTranscriptOrdered').should('be.checked');

      cy.get('#notCalledNote').type(notCalledNote);
      cy.get('#notCalledNote').should('have.value', notCalledNote);

      cy.get('#reCalledNote').first().type(recalledNote);
      cy.get('#reCalledTranscriptOrdered-0').first().check({ force: true });
      cy.get('#reCalledNote').first().should('have.value', recalledNote);
      cy.get('#reCalledTranscriptOrdered-0').first().should('be.checked');

      cy.get('#pretrialConferenceTranscriptOrdered').check({ force: true });
      cy.get('#pretrialConferenceNote').type(pretrialNote);
      cy.get('#pretrialConferenceTranscriptOrdered').should('be.checked');
      cy.get('#pretrialConferenceNote').should('have.value', pretrialNote);

      cy.get('#trialTranscriptOrdered').check({ force: true });
      cy.get('#trialType').select('Trial');
      cy.get('#trialNote').type(trialNote);
      cy.get('#trialType').should('have.value', 'trial');
      cy.get('#trialNote').should('have.value', trialNote);
      cy.get('#trialTranscriptOrdered').should('be.checked');

      cy.get('#hearingTranscriptOrdered').check({ force: true });
      cy.get('#hearingType').select('Hearing');
      cy.get('#hearingNote').type(hearingNote);
      cy.get('#hearingType').should('have.value', 'hearing');
      cy.get('#hearingNote').should('have.value', hearingNote);
      cy.get('#hearingTranscriptOrdered').should('be.checked');

      // JurisdictionFieldset section
      cy.get('#jurisdictionRetainedDate').type('10/06/2023');
      cy.get('#jurisdictionRetainedNote').type(jurisdictionRetainedNote);
      cy.get('#jurisdictionRetainedDate').should('have.value', '10/06/2023');
      cy.get('#jurisdictionRetainedNote').should(
        'have.value',
        jurisdictionRetainedNote,
      );

      cy.get('#jurisdictionContinuedDate').type('10/07/2023');
      cy.get('#continuedNote').type(continuedNote);
      cy.get('#jurisdictionContinuedDate').should('have.value', '10/07/2023');
      cy.get('#continuedNote').should('have.value', continuedNote);

      // Petitioner section
      cy.get('#petitioner-dates-of-appearance-0').type(
        petitionerDatesOfAppearance,
      );
      cy.get('#petitioner-role-0').select('Pro Se');
      cy.get('#petitioner-dates-of-appearance-0').should(
        'have.value',
        petitionerDatesOfAppearance,
      );
      cy.get('#petitioner-role-0').should('have.value', 'proSe');

      // Respondent section
      cy.get('[data-testid="add-respondent-button"]').click();
      selectTypeaheadInput('respondent-1', 'Test IRS Practitioner1');
      cy.get(
        '[data-testid="respondent-1"] .select-react-element__single-value',
      ).should('have.text', 'Test IRS Practitioner1');
      cy.get('[data-testid="remove-respondent-button-1"]').click();
      cy.get('#respondent-date-of-appearance-0').type(
        respondentDatesOfAppearance,
      );
      cy.get('#respondent-date-of-appearance-0').should(
        'have.value',
        respondentDatesOfAppearance,
      );

      cy.get('[data-testid="add-respondent-button"]').click();
      selectTypeaheadInput('respondent-1', 'Custom Respondent');
      cy.get(
        '[data-testid="respondent-1"] .select-react-element__single-value',
      ).should('have.text', 'Custom Respondent');

      // MotionsFieldset section
      cy.get('[data-testid="motion-type-0"]').select('Motion to Dismiss');
      cy.get('[data-testid="motion-oral-0"]').check({ force: true });
      cy.get('[data-testid="motion-filed-by-0"]').select('Petitioner');
      cy.get('[data-testid="motion-status-0"]').select('Granted');
      cy.get('[data-testid="motion-objection-0"]').select('No Objection');
      cy.get('[data-testid="motion-note-0"]').type(firstMotionNote);
      cy.get('[data-testid="add-motion-button"]').click();
      cy.get('[data-testid="motion-type-1"]').select('Motion for Continuance');
      cy.get('[data-testid="motion-oral-1"]').check({ force: true });
      cy.get('[data-testid="motion-filed-by-1"]').select('Respondent');
      cy.get('[data-testid="motion-status-1"]').select('Denied');
      cy.get('[data-testid="motion-objection-1"]').select('Objection');
      cy.get('[data-testid="motion-note-1"]').type(secondMotionNote);
      cy.get('[data-testid="motion-type-0"]').should(
        'have.value',
        'motionToDismiss',
      );
      cy.get('[data-testid="motion-oral-0"]').should('be.checked');
      cy.get('[data-testid="motion-filed-by-0"]').should(
        'have.value',
        'petitioner',
      );
      cy.get('[data-testid="motion-status-0"]').should('have.value', 'granted');
      cy.get('[data-testid="motion-objection-0"]').should(
        'have.value',
        'noObjection',
      );
      cy.get('[data-testid="motion-note-0"]').should(
        'have.value',
        firstMotionNote,
      );
      cy.get('[data-testid="motion-type-1"]').should(
        'have.value',
        'motionForContinuance',
      );
      cy.get('[data-testid="motion-oral-1"]').should('be.checked');
      cy.get('[data-testid="motion-filed-by-1"]').should(
        'have.value',
        'respondent',
      );
      cy.get('[data-testid="motion-status-1"]').should('have.value', 'denied');
      cy.get('[data-testid="motion-objection-1"]').should(
        'have.value',
        'objection',
      );
      cy.get('[data-testid="motion-note-1"]').should(
        'have.value',
        secondMotionNote,
      );

      // Status Report Orders & Stipulated Decision section
      cy.get('#statusReportOrderedFor').select('Petitioner');
      cy.get('#statusReportOrderedNote').type(orderNote);
      cy.get('#statusReportOrderedNote').should('have.value', orderNote);
      cy.get('#statusReportOrderedFor').should('have.value', 'petitioner');

      cy.get('#stipulatedDecisionOrderedNote').type(decisionNote);
      cy.get('#stipulatedDecisionOrderedNote').should(
        'have.value',
        decisionNote,
      );

      // ActionsAndFilingsFieldset section
      cy.get('[id^=actionsAndFilingsDocumentType]').each($el => {
        const rowIndex = $el.attr('id')?.split('-')[1];

        expect(rowIndex).to.not.equal(undefined);

        if (!rowIndex) {
          throw new Error('Expected actions and filings row index to exist');
        }

        cy.get(`#actionsAndFilingsFiledBy-${rowIndex}`).select('Petitioner');
        cy.get(`#actionsAndFilingsFiledBy-${rowIndex}`).should(
          'have.value',
          'petitioner',
        );

        selectTypeaheadInput(
          `actionsAndFilingsDocumentType-search-${rowIndex}`,
          'Entry of Appearance',
        );
        cy.get(`[name=actionsAndFilingsDocumentType-${rowIndex}]`).should(
          'have.value',
          'EA',
        );
        cy.get(`#actionsAndFilingsOralMotion-${rowIndex}`).should('not.exist');
        cy.get(`#actionsAndFilingsObjection-${rowIndex}`).should('not.exist');

        selectTypeaheadInput(
          `actionsAndFilingsDocumentType-search-${rowIndex}`,
          'Motion to Change or Correct Caption',
        );
        cy.get(`[name=actionsAndFilingsDocumentType-${rowIndex}]`).should(
          'have.value',
          'M056',
        );
        cy.get(`#actionsAndFilingsOralMotion-${rowIndex}`).should('exist');
        cy.get(`#actionsAndFilingsObjection-${rowIndex}`).should('exist');

        cy.get(`#actionsAndFilingsStatus-${rowIndex}`).select('Filed');
        cy.get(`#actionsAndFilingsStatus-${rowIndex}`).should(
          'have.value',
          'filed',
        );
        cy.get(`#actionsAndFilingsNote-${rowIndex}`).type(documentDescription);
        cy.get(`#actionsAndFilingsNote-${rowIndex}`).should(
          'have.value',
          documentDescription,
        );
      });

      // TrialBriefFieldset section
      cy.get('#trialBriefNote').type(briefNote);
      cy.get('#trialBriefNote').should('have.value', briefNote);
      cy.get('#briefType').select('Seriatim Brief');
      cy.get('#briefType').should('have.value', 'Seriatim Brief');
      cy.get('#petitioner-openingPartyType').click({ force: true });
      cy.get('#petitioner-openingPartyType').should('be.checked');
      cy.get('#respondent-openingPartyType').click({ force: true });
      cy.get('#respondent-openingPartyType').should('be.checked');
      cy.get('#openingNote').type(openingNotes);
      cy.get('#openingNote').should('have.value', openingNotes);
      cy.get('#petitioner-answeringPartyType').click({ force: true });
      cy.get('#petitioner-answeringPartyType').should('be.checked');
      cy.get('#respondent-answeringPartyType').click({ force: true });
      cy.get('#respondent-answeringPartyType').should('be.checked');
      cy.get('#answeringNote').type(answeringNotes);
      cy.get('#answeringNote').should('have.value', answeringNotes);
      cy.get('#petitioner-replyPartyType').click({ force: true });
      cy.get('#petitioner-replyPartyType').should('be.checked');
      cy.get('#respondent-replyPartyType').click({ force: true });
      cy.get('#respondent-replyPartyType').should('be.checked');
      cy.get('#replyNote').type(replyNotes);
      cy.get('#replyNote').should('have.value', replyNotes);
      cy.get('#petitioner-surReplyPartyType').click({ force: true });
      cy.get('#petitioner-surReplyPartyType').should('be.checked');
      cy.get('#respondent-surReplyPartyType').click({ force: true });
      cy.get('#respondent-surReplyPartyType').should('be.checked');
      cy.get('#surReplyNote').type(surReplyNotes);
      cy.get('#surReplyNote').should('have.value', surReplyNotes);
      cy.get('#briefType').select('Simultaneous Brief');
      cy.get('#briefType').should('have.value', 'Simultaneous Brief');
      cy.get('#openingNote').should('not.have.value');

      // WitnessesFieldset section
      cy.get('[data-testid="petitioner-witness-input-0"]').type(firstWitness);
      cy.get('[data-testid="add-petitioner-witness-button"]').click();
      cy.get('[data-testid="petitioner-witness-input-1"]').type(secondWitness);
      cy.get('[data-testid^="petitioner-witness-input-"]').should(
        'have.length',
        2,
      );
      cy.get('[data-testid="remove-petitioner-witness-button-1"]').click();
      cy.get('[data-testid^="petitioner-witness-input-"]').should(
        'have.length',
        1,
      );

      cy.get('[data-testid="respondent-witness-input-0"]').type(firstWitness);
      cy.get('[data-testid="add-respondent-witness-button"]').click();
      cy.get('[data-testid="respondent-witness-input-1"]').type(secondWitness);
      cy.get('[data-testid^="respondent-witness-input-"]').should(
        'have.length',
        2,
      );
      cy.get('[data-testid="remove-respondent-witness-button-1"]').click();
      cy.get('[data-testid^="respondent-witness-input-"]').should(
        'have.length',
        1,
      );

      // ExhibitsFieldset section
      cy.get('[data-testid="exhibit-description-0"]').type(
        firstExhibitDescription,
      );
      cy.get('[data-testid="exhibit-status-0"]').select('Admitted');
      cy.get('[data-testid="exhibit-note-0"]').type(firstExhibitNote);
      cy.get('[data-testid="add-exhibit-button-0"]').click();
      cy.get('[data-testid="exhibit-description-1"]').type(
        secondExhibitDescription,
      );
      cy.get('[data-testid="exhibit-status-1"]').select('Not admitted');
      cy.get('[data-testid="exhibit-note-1"]').type(secondExhibitNote);
      cy.get('[data-testid^="exhibit-description-"]').should('have.length', 2);
      cy.get('[data-testid="exhibit-status-0"]').should(
        'have.value',
        'admitted',
      );
      cy.get('[data-testid="exhibit-note-0"]').should(
        'have.value',
        firstExhibitNote,
      );
      cy.get('[data-testid="exhibit-status-1"]').should(
        'have.value',
        'notAdmitted',
      );
      cy.get('[data-testid="exhibit-note-1"]').should(
        'have.value',
        secondExhibitNote,
      );
      cy.get('[data-testid="remove-exhibit-button-1"]').click();
      cy.get('[data-testid^="exhibit-description-"]').should('have.length', 1);

      // Navigate away and verify persisted data on return
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get(
        `[data-testid="trial-location-link-${fixture.trialSessionId}"]`,
      ).click();
      cy.get(`[data-testid="minute-sheet-button-${fixture.docketNumber}"]`)
        .invoke('removeAttr', 'target')
        .click();
      cy.get('#remoteSession').should('be.checked');
      cy.get('#courtReporter').should('have.value', courtReporter);

      // Download / preview
      cy.window().then(window => {
        cy.stub(window, 'open').as('windowOpen');
      });
      cy.get('[data-testid="preview-pdf-button-top"]').click();
      cy.get('@windowOpen').should('have.been.called');
    });
  });
});
