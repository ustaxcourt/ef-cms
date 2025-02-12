import { loginAsTrialClerk } from 'cypress/helpers/authentication/login-as-helpers';

const pickFirstMinuteSheet = () => {
  cy.get('#open-cases tbody tr:first-child td:nth-child(2) a')
    .first()
    .invoke('text')
    .then(docketNumber => {
      // Trim any whitespace from the docket number
      const trimmedDocketNumber = docketNumber.trim();
      cy.log(`Docket Number:  ${trimmedDocketNumber}`);

      // Use the docket number to click the minute sheet button
      cy.get(
        `[data-testid="minute-sheet-button-${trimmedDocketNumber}"]`,
      ).click();
    });
};

describe('Access a minute sheet', () => {
  //   beforeEach(() => cy.wait(1000));

  it('access trialsessions page', () => {
    // login as trialclerk1
    loginAsTrialClerk();
    cy.get('[data-testid="trial-session-link"]').click();
    // get minutes sheet link for houston
    cy.get('a').contains('Houston, Texas').click();
  });

  it('Open minute sheet Component', () => {
    pickFirstMinuteSheet();
  });

  describe('Fill out minute sheet form', () => {
    describe('Fill out trial session metadata', () => {
      it('Can see auto filled inputs in Metadata section', () => {
        // The select element should have a preselected value
        cy.get('#judge').contains('John O. Colvin');
        cy.get('#trialClerk').should('have.value', 'Test Trial Clerk');
      });

      it('Can fill out court reporter input and check remote session', () => {
        cy.get('#remoteSession').check({ force: true });
        cy.get('#courtReporter').type('Test Court Reporter');
        cy.wait(500);
        cy.get('#courtReporter').should('have.value', 'Test Court Reporter');
        cy.get('#remoteSession').should('be.checked');

        // Undo changes
        cy.get('#courtReporter').clear();
        cy.get('#remoteSession').uncheck({ force: true });
      });
    });

    describe('Fill out CaseMetadata section', () => {
      it('Can fill out Calendar Called date, note, and check Transcript ordered', () => {
        cy.get('[data-testid="calledNote"]').type('Called note');
        cy.get('[data-testid="calledTranscriptOrdered"]').check({
          force: true,
        });
        cy.wait(500);
        cy.get('#calledNote').should('have.value', 'Called note');
        cy.get('#calledTranscriptOrdered').should('be.checked');

        // Undo changes
        cy.get('#calledNote').clear();
        cy.get('#calledTranscriptOrdered').uncheck({ force: true });
      });

      it('Can fill out Not Called date and note', () => {
        cy.get('#notCalledNote').type('Not called note');
        cy.get('#notCalledNote').should('have.value', 'Not called note');

        // Undo changes
        cy.get('#notCalledNote').clear();
      });

      it('Can fill out Re-called date and note', () => {
        cy.get('#reCalledNote').first().type('Recalled note');
        cy.get('#reCalledTranscriptOrdered-0').first().check({ force: true });
        cy.get('#reCalledNote').first().should('have.value', 'Recalled note');
        cy.get('#reCalledTranscriptOrdered-0').first().should('be.checked');

        // Undo changes
        cy.get('#reCalledNote').first().clear();
        cy.get('#reCalledTranscriptOrdered-0').uncheck({ force: true });
      });

      it('Can fill out Pretrial conference date and note', () => {
        cy.get('#pretrialConferenceTranscriptOrdered').check({ force: true });
        cy.get('#pretrialConferenceNote').type('Pretrial note');
        cy.get('#pretrialConferenceTranscriptOrdered').should('be.checked');
        cy.get('#pretrialConferenceNote').should('have.value', 'Pretrial note');

        // Undo changes
        cy.get('#pretrialConferenceNote').clear();
        cy.get('#pretrialConferenceTranscriptOrdered').uncheck({ force: true });
      });

      it('Can fill out Trial/Hearing date, type, and note', () => {
        cy.get('#trialHearingTranscriptOrdered').check({ force: true });
        cy.get('#trialHearingType').select('Hearing');
        cy.get('#trialHearingNote').type('Trial note');

        cy.get('#trialHearingType').should('have.value', 'hearing');
        cy.get('#trialHearingNote').should('have.value', 'Trial note');
        cy.get('#trialHearingTranscriptOrdered').should('be.checked');

        // Undo changes
        cy.get('#trialHearingNote').clear();
        cy.get('#trialHearingType').select('');
        cy.get('#trialHearingTranscriptOrdered').uncheck({ force: true });
      });
    });

    describe('Fill out JurisdictionFieldset section', () => {
      it('Can fill out Jurisdiction Retained date and note', () => {
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

        // Undo changes
        cy.get('#jurisdictionRetainedDate-picker').clear();
        cy.get('#jurisdictionRetainedNote').clear();
      });

      it('Can fill out Continued date and note', () => {
        cy.get('#jurisdictionContinuedDate-picker').type('10/07/2023');
        cy.get('#continuedNote').type('Continued note');
        cy.get('#jurisdictionContinuedDate-picker').should(
          'have.value',
          '10/07/2023',
        );
        cy.get('#continuedNote').should('have.value', 'Continued note');

        // Undo changes
        cy.get('#jurisdictionContinuedDate-picker').clear();
        cy.get('#continuedNote').clear();
      });
    });

    describe('Fill out Petitioner section', () => {
      it('Can fill out Petitioner section', () => {
        cy.get('#petitioner-dates-of-appearance-0').type(
          '10/10/2021, 11/10/2021',
        );
        cy.get('#petitionerRole-0').select('Pro Se');
        cy.get('#petitioner-dates-of-appearance-0').should(
          'have.value',
          '10/10/2021, 11/10/2021',
        );
        cy.get('#petitionerRole-0').should('have.value', 'proSe');

        // Undo changes
        cy.get('#petitioner-dates-of-appearance-0').clear();
        cy.get('#petitionerRole-0').select('');
      });
    });

    // TODO 10419: fix respondent section
    // describe('Fill out Respondent section', () => {
    //   it('Can fill out Respondent section first row only', () => {
    //     // Select from prepopulated options
    //     // cy.get('#respondent-selectable-0').select('Test IRS Practitioner', {
    //     //   force: true,
    //     // });
    //     cy.get('#respondent-dates-of-appearance-0').type('10/10/2021');

    //     cy.get('#respondent-dates-of-appearance-0').should(
    //       'have.value',
    //       '10/10/2021',
    //     );
    //     // cy.get('#respondent-selectable-0').should(
    //     //   'have.value',
    //     //   'Test IRS Practitioner',
    //     // );

    //     // Undo changes
    //     cy.get('#respondent-dates-of-appearance').clear();
    //     //   cy.get('#respondent-selectable-0').select('');
    //   });

    //   // it('Can type in custom respondent name', () => {
    //   //   cy.get('#respondent-0').type('Custom Respondent');
    //   //   cy.get('#respondent-0').should('have.value', 'Custom Respondent');
    //   //   cy.get('#respondent-0').clear();
    //   // });

    //   // it('Can add a new respondent row', () => {
    //   //   cy.get('#add-respondent-button').click();
    //   //   cy.get('#respondent-1').select('Test IRS Practitioner');
    //   //   cy.get('#respondent-dates-of-appearance-1').type('11/10/2021');

    //   //   cy.get('#respondent-dates-of-appearance-1').should(
    //   //     'have.value',
    //   //     '11/10/2021',
    //   //   );
    //   //   cy.get('#respondent-1').should('have.value', 'Test IRS Practitioner');
    //   // });
    // });

    describe('Fill out MotionsFieldset section', () => {
      // it('Can fill out Motion Type and check Oral Motion - first row', () => {
      //   const motionType = cy.get('label:contains("Type") + select').first();
      //   const oralMotionCheckbox = cy
      //     .get('label:contains("Oral motion") + input')
      //     .first();

      //   motionType.select('Motion to Dismiss');
      //   oralMotionCheckbox.check({ force: true });

      //   motionType.should('have.value', 'motionToDismiss');
      //   oralMotionCheckbox.should('be.checked');

      //   // Undo changes
      //   motionType.select('');
      //   oralMotionCheckbox.uncheck({ force: true });
      // });

      // it('Can fill out Filed By, Status, and Objection', () => {
      //   const filedBy = cy.get('label:contains("Filed by") + select').first();
      //   const status = cy.get('label:contains("Status") + select').first();
      //   const objection = cy
      //     .get('label:contains("Objection") + select')
      //     .first();

      //   filedBy.select('Petitioner');
      //   status.select('Granted');
      //   objection.select('No Objection');

      //   filedBy.should('have.value', 'petitioner');
      //   status.should('have.value', 'granted');
      //   objection.should('have.value', 'noObjection');

      //   // Undo changes
      //   filedBy.select('');
      //   status.select('');
      //   objection.select('');
      // });

      it('Can fill out Motion Note', () => {
        const motionNote = cy.get('label:contains("Note") + input').first();

        motionNote.type('Motion note');
        motionNote.should('have.value', 'Motion note');

        // Undo changes
        motionNote.clear();
      });
    });

    describe('Fill out Jurisdiction section', () => {
      it('Can fill out Jurisdiction section', () => {
        // cy.get('#jurisdictionRetainedDate').type('10/06/2023');
        cy.get('#jurisdictionRetainedNote').type('Jurisdiction note');
        cy.get('#continuedNote').type('Continued note');
        cy.get('#jurisdictionRetainedNote').should(
          'have.value',
          'Jurisdiction note',
        );
        cy.get('#continuedNote').should('have.value', 'Continued note');

        // cy.get('#jurisdictionRetainedDate').should('have.value', '10/06/2023');

        // Undo changes
        cy.get('#jurisdictionRetainedNote').clear();
        cy.get('#continuedNote').clear();
        // cy.get('#jurisdictionRetainedDate').clear();
      });
    });

    describe('Fill out Status Report Orders & Stipulated Decision Section', () => {
      it('Can fill out Status Report Orders section', () => {
        cy.get('#statusReportOrderedFor').select('Petitioner');
        cy.get('#statusReportOrderedNote').type('Order note');

        cy.get('#statusReportOrderedNote').should('have.value', 'Order note');
        cy.get('#statusReportOrderedFor').should('have.value', 'petitioner');

        // Undo changes
        cy.get('#statusReportOrderedNote').clear();
        cy.get('#statusReportOrderedFor').select('');
      });

      it('Can fill out Stipulated Decision section', () => {
        cy.get('#stipulatedDecisionOrderedNote').type('Decision note');
        cy.get('#stipulatedDecisionOrderedNote').should(
          'have.value',
          'Decision note',
        );

        // Undo changes
        cy.get('#stipulatedDecisionOrderedNote').clear();
      });
    });
  });
});
