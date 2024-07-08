import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Session Working Copy', () => {
  beforeEach(() => {
    cy.task('deleteAllFilesInFolder', 'cypress/downloads');
  });

  it('should download a zip file containing all of the the cases(and their docket records) in a trial session', () => {
    loginAsColvin();
    cy.get('[data-testid="view-all-trial-sessions-button"]').click();
    cy.get(
      '[data-testid="trial-location-link-959c4338-0fac-42eb-b0eb-d53b8d0195cc"]',
    ).click();
    cy.get('[data-testid="download-all-trial-session-cases-button"]').click();
    const expectedFileName = 'November_27_2020-Houston_Texas.zip';
    cy.readFile(`cypress/downloads/${expectedFileName}`);
    cy.task<string[]>('unzipFile', { fileName: expectedFileName }).then(
      actualFileNames => {
        const expectedFileNames = [
          '108-19, Garrett Carpenter, Leslie Bullock, Trustee/2019-08-16_0001_Petition.pdf',
          '101-20, Bill Burr/2020-01-02_0001_Petition.pdf',
          '103-20, Reuben Blair/2020-01-23_0001_Petition.pdf',
          '103-20, Reuben Blair/2020-01-23_0003_Notice of Trial on 11272020 at Houston, Texa.pdf',
          '103-20, Reuben Blair/2020-01-23_0004_Administrative Record.pdf',
          '103-20, Reuben Blair/2020-09-21_0005_Notice of Election to Intervene.pdf',
          '103-20, Reuben Blair/2022-12-01_0006_Administrative Record.pdf',
          '108-19, Garrett Carpenter, Leslie Bullock, Trustee/0_Docket Record.pdf',
          '101-20, Bill Burr/0_Docket Record.pdf',
          '103-20, Reuben Blair/0_Docket Record.pdf',
        ];

        expect(actualFileNames).to.deep.equal(expectedFileNames);
      },
    );
  });
});
