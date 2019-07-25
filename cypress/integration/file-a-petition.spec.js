let rowCount;
let createdDocketNumber;

describe('File a petition', function() {
  before(() => {
    cy.seed();
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

describe('creation form', () => {
  before(() => {
    cy.login('taxpayer', 'start-a-case');
  });

  // it('has a file a petition file input', () => {
  //   cy.get('input#petition-file').should('exist');
  //   cy.contains('button[type="submit"]', 'Submit');
  // });

  it('shows validation checkmark when petition file is selected', () => {
    cy.get('form')
      .find('label[for="petition-file"]')
      .scrollIntoView()
      .should('not.have.class', 'validated');

    // select first file
    cy.upload_file('w3-dummy.pdf', 'form #petition-file');

    cy.get('form')
      .find('label[for="petition-file"]')
      .should('have.class', 'validated');
  });

  it('shows validation checkmark when Statement of Taxpayer Identification Number file is selected', () => {
    cy.get('form')
      .find('label[for="stin-file"]')
      .scrollIntoView()
      .should('not.have.class', 'validated');

    // select first file
    cy.upload_file('w3-dummy.pdf', 'form #stin-file');

    cy.get('form')
      .find('label[for="stin-file"]')
      .should('have.class', 'validated');
  });

  it('selects on behalf of myself', () => {
    cy.get('label[for="Myself"]')
      .scrollIntoView()
      .click();
  });

  it('fill in name', () => {
    cy.get('input#name')
      .scrollIntoView()
      .type('John');
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
    cy.get('select[name="contactPrimary.state"]')
      .scrollIntoView()
      .select('AL');
  });

  it('fills in zipcode', () => {
    cy.get('input[name="contactPrimary.postalCode"]')
      .scrollIntoView()
      .type('12345');
  });

  it('fills in phone', () => {
    cy.get('input#phone')
      .scrollIntoView()
      .type('1111111111');
  });

  it('clicks the Yes notice radio button', () => {
    cy.get('#irs-notice-radios').scrollIntoView();
    cy.get('#irs-notice-radios label')
      .first()
      .click();
  });

  it('selects the Notice of Deficiency case type', () => {
    cy.get('#case-type')
      .scrollIntoView()
      .select('Notice of Deficiency');
  });

  it('fills in the date', () => {
    cy.get('#date-of-notice-month')
      .scrollIntoView()
      .type('01');
    cy.get('#date-of-notice-day')
      .scrollIntoView()
      .type('19');
    cy.get('#date-of-notice-year')
      .scrollIntoView()
      .type('1999');
  });

  it('click the small radio button', () => {
    cy.get('#procedure-type-radios').scrollIntoView();
    cy.get('#procedure-type-radios label')
      .first()
      .click();
  });

  it('click the myself radio button', () => {
    cy.get('#filing-type-radios').scrollIntoView();
    cy.get('#filing-type-radios label')
      .first()
      .click();
  });

  it('select a city', () => {
    cy.get('#preferred-trial-city')
      .scrollIntoView()
      .select('Mobile, Alabama');
  });

  it('tries to submit the form without clicking the signature', () => {
    cy.get('form button#submit-case')
      .scrollIntoView()
      .click();
    cy.get('.usa-alert.usa-alert--error').should('exist');
  });

  it('check the signature', () => {
    // why do we click the label instead of the input?  Because a click() or check() on the input doesn't work for some reason.... ಠ_ಠ
    cy.get('#signature + label')
      .scrollIntoView()
      .click();
  });

  it('submits forms and shows a success message', () => {
    cy.server();
    cy.route('POST', '**/cases').as('postCase');
    cy.get('form button#submit-case')
      .scrollIntoView()
      .click();
    cy.wait('@postCase');
    cy.get('@postCase').should(xhr => {
      expect(xhr.responseBody).to.have.property('docketNumber');
      createdDocketNumber = xhr.responseBody.docketNumber;
    });
    cy.get('.usa-alert--success', { timeout: 300000 }).should(
      'contain',
      'successfully submitted',
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
    cy.viewport(1200, 900);
    cy.get('#search-field').type(createdDocketNumber);
    cy.get('#search-input').submit();
    cy.url().should('include', 'case-detail');
  });

  it('shows docket record table and data', () => {
    cy.get('table.case-detail.docket-record tbody tr').should('exist');
  });

  it('accordion header expands/collapses', () => {
    cy.get('#actions-button').should('exist');
    cy.get('#actions-button').click();
    cy.get('#paymentInfo').should('be.visible');
  });
});
