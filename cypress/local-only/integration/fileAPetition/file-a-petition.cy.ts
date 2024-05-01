import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { petitionerAttemptsToUploadCorruptPdf } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';

let createdDocketNumber;

describe('File a petition', function () {
  it('finds footer element', () => {
    cy.login('petitioner');
    cy.get('footer').should('exist');
  });

  it('case list is visible', () => {
    cy.get('table').find('tr').should('exist');
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
    cy.get('label#stin-file-label').scrollIntoView();
    cy.get('label#stin-file-label').should('not.have.class', 'validated');

    cy.get('input#stin-file').attachFile('../fixtures/w3-dummy.pdf');
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
    cy.get('label#petition-file-label').scrollIntoView();
    cy.get('label#petition-file-label').should('not.have.class', 'validated');

    cy.get('input#petition-file').attachFile('../fixtures/w3-dummy.pdf');

    cy.get('label#petition-file-label').should('have.class', 'validated');
  });

  it('clicks the Yes notice radio button', () => {
    cy.get('#irs-notice-radios').scrollIntoView();
    cy.get('#irs-notice-radios label').first().click();
  });

  it('selects the Notice of Deficiency case type', () => {
    cy.get('#case-type').scrollIntoView();
    cy.get('#case-type').select('Notice of Deficiency');
  });

  it('continues to wizard step 3', () => {
    cy.get('button#submit-case').click();
  });

  it('selects on behalf of myself and my spouse', () => {
    cy.get('label#filing-type-1').scrollIntoView();
    cy.get('label#filing-type-1').click();
    cy.get('label#is-spouse-deceased-1').scrollIntoView();
    cy.get('label#is-spouse-deceased-1').click();
    cy.get('button#confirm').scrollIntoView();
    cy.get('button#confirm').click();
  });

  it('fill in name', () => {
    cy.get('input#name').scrollIntoView();
    cy.get('input#name').type('John');
  });

  it("fill in my spouse's name", () => {
    cy.get('input#secondaryName').scrollIntoView();
    cy.get('input#secondaryName').type('Sally');
  });

  it('fill in contactPrimary.address1', () => {
    cy.get('input[name="contactPrimary.address1"]').scrollIntoView();
    cy.get('input[name="contactPrimary.address1"]').type('111 South West St.');
  });

  it('fill in contactPrimary.city', () => {
    cy.get('input[name="contactPrimary.city"]').scrollIntoView();
    cy.get('input[name="contactPrimary.city"]').type('Orlando');
  });

  it('selects state', () => {
    cy.get('select[name="contactPrimary.state"]').scrollIntoView();
    cy.get('select[name="contactPrimary.state"]').select('AL');
  });

  it('fills in zipcode', () => {
    cy.get('input[name="contactPrimary.postalCode"]').scrollIntoView();
    cy.get('input[name="contactPrimary.postalCode"]').type('12345');
  });

  it('fills in phone', () => {
    cy.get('input#phone').scrollIntoView();
    cy.get('input#phone').type('1111111111');
  });

  it("should copy the primary contact's address to the secondary contact's address when the checkbox is selected", () => {
    cy.get('label#use-same-address-above-label').scrollIntoView();
    cy.get('label#use-same-address-above-label').click();
    cy.get('input[name="contactPrimary.address1"]').should(
      'have.value',
      '111 South West St.',
    );
  });

  it('continues to wizard step 4', () => {
    cy.get('button#submit-case').click();
  });

  it('click the regular radio button', () => {
    cy.get('#procedure-type-radios').scrollIntoView();
    cy.get('#procedure-type-radios label').eq(1).click();
  });

  it('select a city', () => {
    cy.get('#preferred-trial-city').scrollIntoView();
    cy.get('#preferred-trial-city').select('Mobile, Alabama');
  });

  it('click the small radio button', () => {
    cy.get('#procedure-type-radios').scrollIntoView();
    cy.get('#procedure-type-radios label').eq(0).click();
  });

  it('select a city', () => {
    cy.get('#preferred-trial-city').should('have.value', '');
    cy.get('#preferred-trial-city').scrollIntoView();
    cy.get('#preferred-trial-city').select('Mobile, Alabama');
  });

  it('reviews information before filing', () => {
    cy.get('button#submit-case').click();
    cy.get('button#petition-preview-button').click();
    cy.get('dialog.modal-screen').should('exist');
    cy.get('button#close-modal-button').click();
  });

  it('submits forms and redirects to the file petition success page', () => {
    cy.intercept('POST', '**/cases').as('postCase');
    cy.get('button#submit-case').scrollIntoView();
    cy.get('button#submit-case').click();
    cy.wait('@postCase').then(({ response }) => {
      expect(response.body).to.have.property('docketNumber');
      createdDocketNumber = response.body.docketNumber;
    });

    // wait for elasticsearch to refresh
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.url().should('include', 'file-a-petition/success');
    cy.get('a#button-back-to-dashboard').click();
  });

  it('case list table reflects newly-added record', () => {
    // the first goToRoute is here so that if this fails, the second goToRoute will
    // actually retry the API calls because it's not staying on the same page
    cy.goToRoute('/file-a-petition/step-1');
    cy.goToRoute('/');
    cy.get('table').find('tr').should('contain.text', createdDocketNumber);
  });
});

describe('users should see expected validation errors when a creating case', () => {
  it('shows the validation error modal when file uploaded is invalid', () => {
    loginAsPetitioner();
    petitionerAttemptsToUploadCorruptPdf();
  });
});

describe('can view case detail', () => {
  before(() => {
    cy.viewport(1200, 900);
    cy.login('petitioner', `/case-detail/${createdDocketNumber}`);
    cy.url().should('include', 'case-detail');
  });

  it('shows docket record table and data', () => {
    cy.get('#docket-record-table tbody tr').should('exist');
  });

  it('displays page count of the petition document', () => {
    cy.get('td.number-of-pages').should('contain.text', '2');
  });
});
