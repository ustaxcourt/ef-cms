describe('File a petition', function() {
  let rowCount;
  let createdDocketNumber;

  describe('Dashboard view', () => {
    before(() => {
      cy.login('taxpayer');
    });

    it('finds footer element', () => {
      cy.get('footer').should('exist');
    });

    it('case list is visible', () => {
      cy.get('table')
        .find('tr')
        .then($trs => {
          rowCount = $trs.length;
        });
      cy.get('#init-file-petition').click();
    });
    describe('USA Banner', () => {
      it('shows header and hides content', () => {
        cy.contains('.usa-banner-header', 'how you know');
        cy.get('.usa-banner-content').should('not.exist');
      });
      it('shows reveals content when clicked, hides when clicked again', () => {
        cy.get('.usa-banner-button').click();
        cy.contains(
          '.usa-banner-content',
          'you are connecting to the official website',
        );
        cy.get('.usa-banner-button').click();
        cy.get('.usa-banner-content').should('not.exist');
      });
    });
  });

  describe('creation form', () => {
    before(() => {
      cy.login('taxpayer', 'file-a-petition');
    });

    it('fills in the fields', () => {
      cy.get('#irsNoticeDate').type('1999-12-31');
      cy.get('#case-type').select('Deficiency');
      cy.get('#procedure-type').select('Small');
      cy.get('#preferred-trial-city').select('Birmingham, Alabama');
    });

    it('has one file inputs', () => {
      cy.get('form#file-a-petition')
        .find('input[type="file"]')
        .should('have.length', 1);
      cy.get('input#petition-file').should('exist');
      cy.contains('button[type="submit"]', 'Upload');
    });

    it('shows validation checkmark when file is selected', () => {
      cy.get('form#file-a-petition')
        .find('label[for="petition-file"]')
        .should('not.have.class', 'validated');

      // select first file
      cy.upload_file('w3-dummy.pdf', 'form#file-a-petition #petition-file');

      cy.get('form#file-a-petition')
        .find('label[for="petition-file"]')
        .should('have.class', 'validated');
    });

    it('submits forms and shows a success message', () => {
      cy.server();
      cy.route('POST', '*/cases').as('postCase');
      cy.get('form#file-a-petition button[type="submit"]').click();
      cy.wait('@postCase');
      cy.get('@postCase').should(xhr => {
        expect(xhr.responseBody).to.have.property('docketNumber');
        createdDocketNumber = xhr.responseBody.docketNumber;
      });
      cy.get('.usa-alert-success', { timeout: 10000 }).should(
        'contain',
        'uploaded successfully',
      );
    });
    it('case list table reflects newly-added record', () => {
      cy.get('table')
        .find('tr')
        .should('have.length', rowCount + 1);
    });
  });

  describe('can view case detail', () => {
    before(() => {
      cy.get('#search-field').type(createdDocketNumber);
      cy.get('#search-input').submit();
      cy.url().should('include', 'case-detail');
    });

    it('shows docket record table and data', () => {
      cy.get('table#docket-record tbody tr').should('exist');
    });

    it('accordion header expands/collapses', () => {
      cy.get('#tab-case-info').click();
      cy.get('#actions-button').should('exist');
      cy.get('#actions-button').click();
      cy.get('#paymentInfo').should('be.visible');
    });
  });
});
