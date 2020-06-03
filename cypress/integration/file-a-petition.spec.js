let rowCount;
let createdDocketNumber;

describe('File a petition', function () {
  before(() => {
    cy.task('seed');
    cy.login('petitioner');
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
    cy.get('#file-a-petition').click();
  });

  describe('USA Banner', () => {
    it('shows header and hides content', () => {
      cy.contains('.usa-banner__header', 'how you know');
      cy.get('.usa-banner__content').should('not.exist');
    });
    it('shows reveals content when clicked, hides when clicked again', () => {
      cy.get('.usa-banner__button').click();
      cy.contains(
        '.usa-banner__content',
        'you are connecting to the official website',
      );
      cy.get('.usa-banner__button').click();
      cy.get('.usa-banner__content').should('not.exist');
    });
  });
});

describe('before filing a petition', () => {
  beforeEach(() => {
    cy.login('petitioner', 'before-filing-a-petition');
  });

  it('should navigate to dashboard when cancel is clicked', () => {
    cy.get('button#cancel').click();

    cy.get('button.modal-button-confirm').click();

    cy.url().should('not.include', 'before-filing-a-petition');
  });

  it('should navigate to dashboard when close is clicked', () => {
    cy.get('button#cancel').click();

    cy.get('button.text-no-underline').click();

    cy.url().should('not.include', 'before-filing-a-petition');
  });
});

describe('creation form', () => {
  before(() => {
    cy.login('petitioner', 'file-a-petition/step-1');
  });

  it('has a stin file input', () => {
    cy.get('input#stin-file').should('exist');
    cy.contains('button#submit-case', 'Continue to Step 2 of 5');
  });

  it('shows validation check mark when Statement of Taxpayer Identification Number file is selected', () => {
    cy.get('label#stin-file-label')
      .scrollIntoView()
      .should('not.have.class', 'validated');

    // select first file
    cy.upload_file('w3-dummy.pdf', 'input#stin-file');

    cy.get('label#stin-file-label').should('have.class', 'validated');
  });

  it('continues to wizard step 2', () => {
    cy.get('button#submit-case').click();
  });

  it('has a petition file input', () => {
    cy.get('input#petition-file').should('exist');
    cy.contains('button#submit-case', 'Continue to Step 3 of 5');
  });

  it('shows validation check mark when Petition file is selected', () => {
    cy.get('label#petition-file-label')
      .scrollIntoView()
      .should('not.have.class', 'validated');

    // select first file
    cy.upload_file('w3-dummy.pdf', 'input#petition-file');

    cy.get('label#petition-file-label').should('have.class', 'validated');
  });

  it('clicks the Yes notice radio button', () => {
    cy.get('#irs-notice-radios').scrollIntoView();
    cy.get('#irs-notice-radios label').first().click();
  });

  it('selects the Notice of Deficiency case type', () => {
    cy.get('#case-type').scrollIntoView().select('Notice of Deficiency');
  });

  it('continues to wizard step 3', () => {
    cy.get('button#submit-case').click();
  });

  it('selects on behalf of myself and my spouse', () => {
    cy.get('label#filing-type-1').scrollIntoView().click();
    cy.get('label#is-spouse-deceased-1').scrollIntoView().click();
    cy.get('button#confirm').scrollIntoView().click();
  });

  it('fill in name', () => {
    cy.get('input#name').scrollIntoView().type('John');
  });

  it("fill in my spouse's name", () => {
    cy.get('input#secondaryName').scrollIntoView().type('Sally');
  });

  it('fill in contactPrimary.address1', () => {
    cy.get('input[name="contactPrimary.address1"]')
      .scrollIntoView()
      .type('111 South West St.');
  });

  it('fill in contactPrimary.city', () => {
    cy.get('input[name="contactPrimary.city"]')
      .scrollIntoView()
      .type('Orlando');
  });

  it('selects state', () => {
    cy.get('select[name="contactPrimary.state"]').scrollIntoView().select('AL');
  });

  it('fills in zipcode', () => {
    cy.get('input[name="contactPrimary.postalCode"]')
      .scrollIntoView()
      .type('12345');
  });

  it('fills in phone', () => {
    cy.get('input#phone').scrollIntoView().type('1111111111');
  });

  it("should copy the primary contact's address to the secondary contact's address when the checkbox is selected", () => {
    cy.get('label#use-same-address-above-label').scrollIntoView().click();
    cy.get('input[name="contactPrimary.address1"]').should(
      'have.value',
      '111 South West St.',
    );
  });

  it('continues to wizard step 4', () => {
    cy.get('button#submit-case').click();
  });

  it('click the small radio button', () => {
    cy.get('#procedure-type-radios').scrollIntoView();
    cy.get('#procedure-type-radios label').first().click();
  });

  it('select a city', () => {
    cy.get('#preferred-trial-city').scrollIntoView().select('Mobile, Alabama');
  });

  it('reviews information before filing', () => {
    cy.get('button#submit-case').click();
  });

  it('submits forms and redirects to the file petition success page', () => {
    cy.server();
    cy.route('POST', '**/cases').as('postCase');
    cy.get('button#submit-case').scrollIntoView().click();
    cy.wait('@postCase');
    cy.get('@postCase').should(xhr => {
      // eslint-disable-next-line jest/valid-expect
      expect(xhr.responseBody).to.have.property('docketNumber');
      createdDocketNumber = xhr.responseBody.docketNumber;
    });
    cy.url().should('include', 'file-a-petition/success');
    cy.get('a#button-back-to-dashboard').click();
  });

  it('case list table reflects newly-added record', () => {
    cy.get('table')
      .find('tr')
      .should('have.length', rowCount + 1);
  });
});

describe('can view case detail', () => {
  before(() => {
    cy.viewport(1200, 900);
    cy.login('petitioner', `/case-detail/${createdDocketNumber}`);
    cy.url().should('include', 'case-detail');
  });

  it('shows docket record table and data', () => {
    cy.get('table.case-detail.docket-record tbody tr').should('exist');
  });
});
