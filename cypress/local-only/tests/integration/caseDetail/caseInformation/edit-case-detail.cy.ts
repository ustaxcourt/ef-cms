import { loginAsDocketClerk } from 'cypress/helpers/authentication/login-as-helpers';
import {
  getButton,
  getCaptionTextArea,
  getCaseDetailTab,
  getCaseTitleContaining,
  getEditCaseCaptionButton,
} from '../../../../support/pages/case-detail';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import {
  CASE_TYPES_MAP,
  PENALTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { docketNumber } from 'cypress/local-only/support/statusReportOrder';

describe('Edit a case caption from case detail header', function () {
  const getDeficiencyStatistics = (docketNumber: string): RawStatistic[] => {
    return [
      {
        determinationDeficiencyAmount: undefined,
        determinationTotalPenalties: undefined,
        docketNumber,
        irsDeficiencyAmount: '5678',
        irsTotalPenalties: '300', // Should match penalties below
        lastDateOfPeriod: undefined,
        statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
        year: 2018,
        yearOrPeriod: 'Year',
        updatedAt: '',
        penalties: [
          {
            name: 'Marie de France',
            penaltyAmount: '100',
            penaltyId: 'ab557362-50ee-4440-aaff-0a9f1bfa30ed',
            penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
            statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
            updatedAt: '',
          },
          {
            name: 'John of Gaunt',
            penaltyAmount: '200',
            penaltyId: 'bb557362-50ee-4440-aaff-0a9f1bfa30ed',
            penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
            statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
            updatedAt: '',
          },
        ],
      },
      {
        determinationDeficiencyAmount: undefined,
        determinationTotalPenalties: undefined,
        docketNumber,
        irsDeficiencyAmount: '5678',
        irsTotalPenalties: '1234',
        lastDateOfPeriod: undefined,
        statisticId: 'bb557361-50ee-4440-aaff-0a9f1bfa30ed',
        year: 2019,
        yearOrPeriod: 'Year',
        updatedAt: '',
      },
      {
        determinationDeficiencyAmount: undefined,
        determinationTotalPenalties: undefined,
        docketNumber,
        irsDeficiencyAmount: '5678',
        irsTotalPenalties: '1234',
        lastDateOfPeriod: undefined,
        statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
        year: 2019,
        yearOrPeriod: 'Year',
        updatedAt: '',
      },
    ];
  };

  it('should changes the title of the case', () => {
    createAndServePaperPetition({ yearReceived: '1950' }).then(caseRecord => {
      loginAsDocketClerk();
      cy.visit(`/case-detail/${caseRecord}`);

      it('should change the title of the case', () => {
        getCaseDetailTab('case-information').click();
        getEditCaseCaptionButton().click();
        getCaptionTextArea().clear().type('there is no cow level');
        getButton('Save').click();
        getCaseTitleContaining(
          'there is no cow level v. Commissioner of Internal Revenue, Respondent',
        ).should('exist');
      });

      it('should change type of case to deficiency', () => {
        getCaseDetailTab('case-information').click();
        getEditCaseCaptionButton().click();
        cy.get('[data-testid="case-type-select"]').select(
          CASE_TYPES_MAP.deficiency,
        );
        getButton('Save').click();
        cy.contains('p', CASE_TYPES_MAP.deficiency);
      });

      it('should add deficiency statistics', () => {
        getButton('Statistics').click();
        for (const statistic of getDeficiencyStatistics(docketNumber)) {
          cy.contains('a', 'Add New Year/Period').click();
          cy.get('[data-testid="deficiency-statistic-year"]').type(
            statistic.year,
          );
          cy.get('[data-testid="irs-deficiency-amount"]').type(
            statistic.irsDeficiencyAmount,
          );
          cy.get('[data-testid="determination-deficiency-amount"]').type(
            statistic.determinationDeficiencyAmount,
          );
          getButton('Calculate penalties on IRS Notice').click();
          
        }
      });

      it('should show statistic penalties in the correct order', () => {});
    });
  });
});
