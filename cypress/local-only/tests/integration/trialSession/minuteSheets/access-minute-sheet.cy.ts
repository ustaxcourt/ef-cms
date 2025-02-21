import {
  loginAsTrialClerk,
  loginAsIrsPractitioner,
  loginAsCaseServicesSupervisor,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import {
  getCaseDetailTab,
  navigateTo as navigateToCaseDetail,
} from '../../../../support/pages/case-detail';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
import { attachFile } from 'cypress/helpers/file/upload-file';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

describe('Access a minute sheet, fill out sections of the form, navigate away and return to the form with data intact', () => {
  before(function () {
    createAndServePaperPetition({ trialLocation: 'Birmingham, Alabama' }).then(
      ({ docketNumber }) => {
        loginAsIrsPractitioner();
        navigateToCaseDetail('irspractitioner', docketNumber);
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
        createTrialSession({ trialLocation: 'Birmingham, Alabama' }).then(
          ({ trialSessionId }) => {
            cy.visit(`/trial-session-detail/${trialSessionId}`);
            cy.get(`[data-testid=qc-complete-${docketNumber}]`).click({
              force: true,
            });
            cy.get('[data-testid=set-calendar-button]').click();
            cy.get('[data-testid=modal-button-confirm]').click();
            cy.get('[data-testid=printing-complete]').click();

            cy.wrap(trialSessionId).as('trialSessionId');
            cy.wrap(docketNumber).as('docketNumber');
          },
        );
      },
    );
  });

  describe('Fill out minute sheet form', function () {
    describe('Fill out trial session metadata', function () {
      it('Can see auto filled inputs in Metadata section', function () {
        loginAsTrialClerk();
        cy.visit('/trial-sessions');
        cy.get(
          `[data-testid="trial-location-link-${this.trialSessionId}"]`,
        ).click();
        cy.get(
          `[data-testid="minute-sheet-button-${this.docketNumber}"]`,
        ).click();
        cy.get('#judge').contains('Lewis R. Carluzzo');
        cy.get('#trialClerk').should('have.value', 'Test trialclerk1');
      });

      it('Can fill out court reporter input and check remote session', function () {
        cy.get('#remoteSession').check({ force: true });
        cy.get('#courtReporter').type('Test Court Reporter');

        cy.get('#courtReporter').should('have.value', 'Test Court Reporter');
        cy.get('#remoteSession').should('be.checked');

        cy.get('#courtReporter').clear();
        cy.get('#remoteSession').uncheck({ force: true });
      });
    });

    describe('Fill out CaseMetadata section', function () {
      it('Can fill out Calendar Called date, note, and check Transcript ordered', function () {
        cy.get(
          '.usa-date-picker__wrapper > [data-testid="calledDate-picker"]',
        ).type('2/21/2024');
        cy.get('[data-testid="calledNote"]').type('Called note');
        cy.get('[data-testid="calledTranscriptOrdered"]').check({
          force: true,
        });

        cy.get('#calledNote').should('have.value', 'Called note');
        cy.get('#calledTranscriptOrdered').should('be.checked');

        cy.get('#calledNote').clear();
        cy.get('#calledTranscriptOrdered').uncheck({ force: true });
      });

      it('Can fill out Not Called date and note', function () {
        cy.get('#notCalledNote').type('Not called note');
        cy.get('#notCalledNote').should('have.value', 'Not called note');

        // Undo changes
        cy.get('#notCalledNote').clear();
      });

      it('Can fill out Re-called date and note', function () {
        cy.get('#reCalledNote').first().type('Recalled note');
        cy.get('#reCalledTranscriptOrdered-0').first().check({ force: true });
        cy.get('#reCalledNote').first().should('have.value', 'Recalled note');
        cy.get('#reCalledTranscriptOrdered-0').first().should('be.checked');

        cy.get('#reCalledNote').first().clear();
        cy.get('#reCalledTranscriptOrdered-0').uncheck({
          force: true,
        });
      });

      it('Can fill out Pretrial conference date and note', function () {
        cy.get('#pretrialConferenceTranscriptOrdered').check({
          force: true,
        });
        cy.get('#pretrialConferenceNote').type('Pretrial note');
        cy.get('#pretrialConferenceTranscriptOrdered').should('be.checked');
        cy.get('#pretrialConferenceNote').should('have.value', 'Pretrial note');

        cy.get('#pretrialConferenceNote').clear();
        cy.get('#pretrialConferenceTranscriptOrdered').uncheck({
          force: true,
        });
      });

      it('Can fill out Trial/Hearing date, type, and note', function () {
        cy.get('#trialHearingTranscriptOrdered').check({
          force: true,
        });
        cy.get('#trialHearingType').select('Hearing');
        cy.get('#trialHearingNote').type('Trial note');

        cy.get('#trialHearingType').should('have.value', 'hearing');
        cy.get('#trialHearingNote').should('have.value', 'Trial note');
        cy.get('#trialHearingTranscriptOrdered').should('be.checked');

        cy.get('#trialHearingNote').clear();
        cy.get('#trialHearingType').select('');
        cy.get('#trialHearingTranscriptOrdered').uncheck({
          force: true,
        });
      });
    });

    describe('Fill out JurisdictionFieldset section', function () {
      it('Can fill out Jurisdiction Retained date and note', function () {
        cy.get('#jurisdictionRetainedDate-picker').type('10/06/2023');
        cy.get('#jurisdictionRetainedNote').type('Jurisdiction retained note');
        cy.get('#jurisdictionRetainedDate-picker').should(
          'have.value',
          '10/06/2023',
        );
        cy.get('#jurisdictionRetainedNote').should(
          'have.value',
          'Jurisdiction retained note',
        );
      });

      it('Can fill out Continued date and note', function () {
        cy.get('#jurisdictionContinuedDate-picker').type('10/07/2023');
        cy.get('#continuedNote').type('Continued note');
        cy.get('#jurisdictionContinuedDate-picker').should(
          'have.value',
          '10/07/2023',
        );
        cy.get('#continuedNote').should('have.value', 'Continued note');
      });
    });

    describe('Fill out Petitioner section', function () {
      it('Can fill out Petitioner section', function () {
        cy.get('#petitioner-dates-of-appearance-0').type(
          '10/10/2021, 11/10/2021',
        );
        cy.get('#petitionerRole-0').select('Pro Se');
        cy.get('#petitioner-dates-of-appearance-0').should(
          'have.value',
          '10/10/2021, 11/10/2021',
        );
        cy.get('#petitionerRole-0').should('have.value', 'proSe');
      });
    });

    describe('Fill out Respondent section', function () {
      it('Can fill out Respondent section', function () {
        cy.get('[data-testid="add-respondent-button"]').click();
        selectTypeaheadInput('respondent-1', 'Test IRS Practitioner1');
        cy.get(
          '[data-testid="respondent-1"] .select-react-element__single-value',
        ).then(function ($el) {
          const text = $el.text();
          expect(text).to.equal('Test IRS Practitioner1');
        });

        cy.get('[data-testid="remove-respondent-button-1"]').click();

        cy.get('#respondent-date-of-appearance-0').type('02/22, 03/22');
      });

      it('Can type in custom respondent name', function () {
        cy.get('[data-testid="add-respondent-button"]').click();
        selectTypeaheadInput('respondent-1', 'Custom Respondent');
        cy.get(
          '[data-testid="respondent-1"] .select-react-element__single-value',
        ).then(function ($el) {
          const text = $el.text();
          expect(text).to.equal('Custom Respondent');
        });
      });
    });

    describe('Fill out MotionsFieldset section', () => {
      it('Can add and fill out multiple motion rows', () => {
        // Fill out first motion
        cy.get('[data-testid="motion-type-0"]').select('Motion to Dismiss');
        cy.get('[data-testid="motion-oral-0"]').check({ force: true });
        cy.get('[data-testid="motion-filed-by-0"]').select('Petitioner');
        cy.get('[data-testid="motion-status-0"]').select('Granted');
        cy.get('[data-testid="motion-objection-0"]').select('No Objection');
        cy.get('[data-testid="motion-note-0"]').type('First motion note');

        // Add second motion
        cy.get('[data-testid="add-motion-button"]').click();

        // Fill out second motion
        cy.get('[data-testid="motion-type-1"]').select(
          'Motion for Continuance',
        );
        cy.get('[data-testid="motion-oral-1"]').check({ force: true });
        cy.get('[data-testid="motion-filed-by-1"]').select('Respondent');
        cy.get('[data-testid="motion-status-1"]').select('Denied');
        cy.get('[data-testid="motion-objection-1"]').select('Objection');
        cy.get('[data-testid="motion-note-1"]').type('Second motion note');

        // Verify first motion values
        cy.get('[data-testid="motion-type-0"]').should(
          'have.value',
          'motionToDismiss',
        );
        cy.get('[data-testid="motion-oral-0"]').should('be.checked');
        cy.get('[data-testid="motion-filed-by-0"]').should(
          'have.value',
          'petitioner',
        );
        cy.get('[data-testid="motion-status-0"]').should(
          'have.value',
          'granted',
        );
        cy.get('[data-testid="motion-objection-0"]').should(
          'have.value',
          'noObjection',
        );
        cy.get('[data-testid="motion-note-0"]').should(
          'have.value',
          'First motion note',
        );

        // Verify second motion values
        cy.get('[data-testid="motion-type-1"]').should(
          'have.value',
          'motionForContinuance',
        );
        cy.get('[data-testid="motion-oral-1"]').should('be.checked');
        cy.get('[data-testid="motion-filed-by-1"]').should(
          'have.value',
          'respondent',
        );
        cy.get('[data-testid="motion-status-1"]').should(
          'have.value',
          'denied',
        );
        cy.get('[data-testid="motion-objection-1"]').should(
          'have.value',
          'objection',
        );
        cy.get('[data-testid="motion-note-1"]').should(
          'have.value',
          'Second motion note',
        );
      });
    });

    describe('Fill out Status Report Orders & Stipulated Decision Section', () => {
      it('Can fill out Status Report Orders section', () => {
        cy.get('#statusReportOrderedFor').select('Petitioner');
        cy.get('#statusReportOrderedNote').type('Order note');

        cy.get('#statusReportOrderedNote').should('have.value', 'Order note');
        cy.get('#statusReportOrderedFor').should('have.value', 'petitioner');

        cy.get('#statusReportOrderedNote').clear();
        cy.get('#statusReportOrderedFor').select('');
      });

      it('Can fill out Stipulated Decision section', () => {
        cy.get('#stipulatedDecisionOrderedNote').type('Decision note');
        cy.get('#stipulatedDecisionOrderedNote').should(
          'have.value',
          'Decision note',
        );

        cy.get('#stipulatedDecisionOrderedNote').clear();
      });
    });

    describe('Fill out ActionsAndFilingsFieldset section', () => {
      it('Can fill out ActionsAndFilingsFieldset section', () => {
        cy.get('[id^=actionsAndFilingsDocumentType]').each($el => {
          const renderKey = $el.attr('id')?.split('-')[1];
          cy.log(`Render key: ${renderKey}`);

          cy.get(`#actionsAndFilingsDocumentType-${renderKey}`).select(
            'Entry of Appearance',
          );
          cy.get(`#actionsAndFilingsDocumentType-${renderKey}`).should(
            'have.value',
            'entryOfAppearance',
          );

          cy.get(`#actionsAndFilingsFiledBy-${renderKey}`).select('Petitioner');
          cy.get(`#actionsAndFilingsFiledBy-${renderKey}`).should(
            'have.value',
            'petitioner',
          );

          cy.get(`#actionsAndFilingsStatus-${renderKey}`).select('Filed');
          cy.get(`#actionsAndFilingsStatus-${renderKey}`).should(
            'have.value',
            'filed',
          );

          cy.get(`#actionsAndFilingsNote-${renderKey}`).type(
            'Document description',
          );
          cy.get(`#actionsAndFilingsNote-${renderKey}`).should(
            'have.value',
            'Document description',
          );

          cy.get(`#actionsAndFilingsDocumentType-${renderKey}`).select('');
          cy.get(`#actionsAndFilingsNote-${renderKey}`).clear();
          cy.get(`#actionsAndFilingsFiledBy-${renderKey}`).select('');
          cy.get(`#actionsAndFilingsStatus-${renderKey}`).select('');
        });
      });
    });

    describe('Fill out TrialBriefFieldset section', () => {
      it('Can fill out TrialBriefFieldset section - Seriatim Brief', () => {
        cy.get('#trialBriefNote').type('Brief note');
        cy.get('#trialBriefNote').should('have.value', 'Brief note');

        cy.get('#briefType').select('Seriatim Brief');
        cy.get('#briefType').should('have.value', 'Seriatim Brief');

        cy.get('#petitioner-openingPartyType').click({ force: true });
        cy.get('#petitioner-openingPartyType').should('be.checked');

        cy.get('#respondent-openingPartyType').click({ force: true });
        cy.get('#respondent-openingPartyType').should('be.checked');

        cy.get('#openingNote').type('Opening notes');
        cy.get('#openingNote').should('have.value', 'Opening notes');

        // Answering
        cy.get('#petitioner-answeringPartyType').click({
          force: true,
        });
        cy.get('#petitioner-answeringPartyType').should('be.checked');

        cy.get('#respondent-answeringPartyType').click({
          force: true,
        });
        cy.get('#respondent-answeringPartyType').should('be.checked');

        cy.get('#answeringNote').type('Answering notes');
        cy.get('#answeringNote').should('have.value', 'Answering notes');

        // Reply
        cy.get('#petitioner-replyPartyType').click({ force: true });
        cy.get('#petitioner-replyPartyType').should('be.checked');

        cy.get('#respondent-replyPartyType').click({ force: true });
        cy.get('#respondent-replyPartyType').should('be.checked');

        cy.get('#replyNote').type('Reply notes');
        cy.get('#replyNote').should('have.value', 'Reply notes');

        cy.get('#petitioner-surReplyPartyType').click({
          force: true,
        });
        cy.get('#petitioner-surReplyPartyType').should('be.checked');

        cy.get('#respondent-surReplyPartyType').click({
          force: true,
        });
        cy.get('#respondent-surReplyPartyType').should('be.checked');

        cy.get('#surReplyNote').type('Sur-reply notes');
        cy.get('#surReplyNote').should('have.value', 'Sur-reply notes');
      });

      it('Can open Seriatim Memorandum Brief section', () => {
        cy.get('#briefType').select('Seriatim Memorandum Brief');
        cy.get('#briefType').should('have.value', 'Seriatim Memorandum Brief');
      });
    });

    describe('Fill out Petitioner WitnessesFieldset section', () => {
      it('Can add a row and fill in text input', () => {
        cy.get('[data-testid="petitioner-witness-input-0"]').type('John Smith');

        cy.get('[data-testid="add-petitioner-witness-button"]').click();
        cy.get('[data-testid="petitioner-witness-input-1"]').type('Jane Doe');

        cy.get('[data-testid^="petitioner-witness-input-"]').should(
          'have.length',
          2,
        );
        cy.get('[data-testid="remove-petitioner-witness-button-1"]').click();
        cy.get('[data-testid^="petitioner-witness-input-"]').should(
          'have.length',
          1,
        );
      });
    });

    describe('Fill out Respondent WitnessesFieldset section', () => {
      it('Can add a row and fill in text input', () => {
        cy.get('[data-testid="respondent-witness-input-0"]').type('John Smith');

        cy.get('[data-testid="add-respondent-witness-button"]').click();
        cy.get('[data-testid="respondent-witness-input-1"]').type('Jane Doe');

        cy.get('[data-testid^="respondent-witness-input-"]').should(
          'have.length',
          2,
        );
        cy.get('[data-testid="remove-respondent-witness-button-1"]').click();
        cy.get('[data-testid^="respondent-witness-input-"]').should(
          'have.length',
          1,
        );
      });
    });

    describe('Fill out ExhibitsFieldset section', () => {
      it('Can add a row and fill in text input', () => {
        cy.get('[data-testid="exhibit-description-0"]').type('Exhibit A');
        cy.get('[data-testid="exhibit-status-0"]').select('Admitted');
        cy.get('[data-testid="exhibit-note-0"]').type('First exhibit note');

        cy.get('[data-testid="add-exhibit-button"]').click();
        cy.get('[data-testid="exhibit-description-1"]').type('Exhibit B');
        cy.get('[data-testid="exhibit-status-1"]').select('Not admitted');
        cy.get('[data-testid="exhibit-note-1"]').type('Second exhibit note');

        cy.get('[data-testid^="exhibit-description-"]').should(
          'have.length',
          2,
        );
        cy.get('[data-testid="exhibit-status-0"]').should(
          'have.value',
          'admitted',
        );
        cy.get('[data-testid="exhibit-note-0"]').should(
          'have.value',
          'First exhibit note',
        );
        cy.get('[data-testid="exhibit-status-1"]').should(
          'have.value',
          'notAdmitted',
        );
        cy.get('[data-testid="exhibit-note-1"]').should(
          'have.value',
          'Second exhibit note',
        );

        cy.get('[data-testid="remove-exhibit-button-1"]').click();
        cy.get('[data-testid^="exhibit-description-"]').should(
          'have.length',
          1,
        );
      });
    });

    describe('Test that data is saved when navigating away', function () {
      it('Can navigate away and back to minute sheet and see data is saved', function () {
        cy.get('#remoteSession').check({ force: true });
        cy.get('#courtReporter').type('Test Court Reporter');
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get(
          `[data-testid="trial-location-link-${this.trialSessionId}"]`,
        ).click();
        cy.get(
          `[data-testid="minute-sheet-button-${this.docketNumber}"]`,
        ).click();
        cy.get('#remoteSession').should('be.checked');
        cy.get('#courtReporter').should('have.value', 'Test Court Reporter');
      });
    });

    describe('Download the minute sheet', function () {
      it('Can download the minute sheet', function () {
        cy.visit(
          `/trial-session-detail/${this.trialSessionId}/case/${this.docketNumber}/minutes`,
        ).then(window => {
          cy.stub(window, 'open').as('windowOpen');
          cy.get('[data-testid="download-pdf-button"]').click();
          cy.get('@windowOpen').should('have.been.called');
        });
      });
    });
  });
});
