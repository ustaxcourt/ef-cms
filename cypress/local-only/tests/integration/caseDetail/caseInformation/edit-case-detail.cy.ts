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
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  PENALTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { docketNumber } from 'cypress/local-only/support/statusReportOrder';
import { Penalty } from '@shared/business/entities/Penalty';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { formatDollars } from '@shared/business/utilities/formatDollars';

const getDeficiencyStatistics = (docketNumber: string): RawStatistic[] => {
  return [
    {
      _sortOrder: 1,
      docketNumber,
      lastDateOfPeriod: '2019-12-16T00:00:00.000-05:00',
      statisticId: 'bb557361-50ee-4440-aaff-0a9f1bfa30ed',
      year: undefined,
      yearOrPeriod: 'Period',
      updatedAt: '',
      irsDeficiencyAmount: '5678',
      determinationDeficiencyAmount: '200',
      irsTotalPenalties: '1',
      determinationTotalPenalties: '1',
      penalties: [
        {
          name: 'Hugh of St. Victor',
          penaltyAmount: '1', // IRS Notice
          penaltyId: 'd0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: 'bb557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
        {
          name: 'Alan of Lille',
          penaltyAmount: '1', // Determination
          penaltyId: 'e0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
          statisticId: 'bb557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
      ],
    },
    {
      _sortOrder: 0,
      docketNumber,
      lastDateOfPeriod: undefined,
      statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
      year: 2018,
      yearOrPeriod: 'Year',
      updatedAt: '',
      irsDeficiencyAmount: '5678',
      determinationDeficiencyAmount: '100',
      irsTotalPenalties: '300', // Should match penalties below
      determinationTotalPenalties: '5',
      penalties: [
        {
          name: 'Marie de France',
          penaltyAmount: '100', // IRS Notice
          penaltyId: 'a0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
        {
          name: 'John of Gaunt',
          penaltyAmount: '200', // IRS Notice
          penaltyId: 'b0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
        {
          name: 'Einhard',
          penaltyAmount: '5', // determination
          penaltyId: 'c0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
          statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
      ],
    },
    {
      _sortOrder: 2,
      docketNumber,
      lastDateOfPeriod: undefined,
      statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
      year: 2019,
      yearOrPeriod: 'Year',
      updatedAt: '',
      irsDeficiencyAmount: '5678',
      determinationDeficiencyAmount: '300',
      irsTotalPenalties: '3',
      determinationTotalPenalties: '2',
      penalties: [
        {
          name: 'John of Salisbury',
          penaltyAmount: '3', // IRS Notice
          penaltyId: 'e0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
          statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
        {
          name: 'Roscellinus',
          penaltyAmount: '2', // Determination
          penaltyId: 'e0a52030-1ba5-4b1a-bb62-b5e591ea434e',
          penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
          statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
          updatedAt: '',
        },
      ],
    },
  ];
};

describe('View/Edit case detail', () => {
  before(function () {
    createAndServePaperPetition({ yearReceived: '1950' }).then(caseRecord => {
      cy.wrap(caseRecord.docketNumber).as('docketNumber');
    });
  });

  it('should show correct initial case statuses', function () {
    loginAsDocketClerk();
    cy.visit(`/case-detail/${this.docketNumber}`);
    getCaseDetailTab('case-information').click();
    cy.get('[data-testid="case-status-history-tab"]').click();
    // We should have two case statuses, the first New and the second General Docket - Not at Issue
    cy.get('[data-testid="case-status-history-container"]')
      .find('tbody tr')
      .should('have.length', 2)
      .as('statusRows');

    cy.get('@statusRows')
      .eq(0)
      .find('td')
      .eq(1)
      .should('have.text', CASE_STATUS_TYPES.new);

    cy.get('@statusRows')
      .eq(1)
      .find('td')
      .eq(1)
      .should('have.text', CASE_STATUS_TYPES.generalDocket);
  });

  it('should change the title of the case', function () {
    cy.get('[data-testid="case-overview-tab"]').click();
    getEditCaseCaptionButton().click();
    getCaptionTextArea().clear().type('there is no cow level');
    getButton('Save').click();
    getCaseTitleContaining(
      'there is no cow level v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });

  it('should change type of case (to deficiency)', function () {
    cy.get('[data-testid="edit-case-details-button"]').click();
    cy.get('[data-testid="case-type-select"]').select(
      CASE_TYPES_MAP.deficiency,
    );
    getButton('Save').click();
    cy.contains('p', CASE_TYPES_MAP.deficiency);
  });

  it('should add deficiency statistics', function () {
    cy.get('[data-testid="case-statistics-tab"]').click();
    for (const statistic of getDeficiencyStatistics(docketNumber)) {
      cy.contains('a', 'Add New Year/Period').click();
      cy.get(`[data-testid="year-or-period-${statistic.yearOrPeriod}"]`);

      if (statistic.yearOrPeriod === 'Period') {
        cy.get('[data-testid="year-or-period-Period"]').click({
          force: true,
        });
        // Get data-testid to work ... using id because we multiply the data-testid apparently
        cy.get('#last-date-of-period-picker').type(
          formatDateString(statistic.lastDateOfPeriod, FORMATS.MMDDYYYY),
        );
      } else {
        cy.get('[data-testid="deficiency-statistic-year"]').type(
          statistic.year,
        );
      }
      cy.get('[data-testid="irs-deficiency-amount"]').type(
        statistic.irsDeficiencyAmount,
      );
      cy.get('[data-testid="determination-deficiency-amount"]').type(
        statistic.determinationDeficiencyAmount,
      );

      getButton('Calculate penalties on IRS Notice').click();
      const irsPenalties = statistic.penalties.filter(
        (p: Penalty) => p.penaltyType === PENALTY_TYPES.IRS_PENALTY_AMOUNT,
      );
      const courtDeterminationPenalties = statistic.penalties.filter(
        (p: Penalty) =>
          p.penaltyType === PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
      );
      for (let i = 0; i < irsPenalties.length; i++) {
        console.log(i, irsPenalties[i]);
        cy.get(`[data-testid="penalty_${i}"]`).type(
          irsPenalties[i].penaltyAmount,
        );
        getButton('Add another penalty').click();
      }
      getButton('Calculate and Save').click();

      getButton('Calculate penalties as determined by Court').click();
      for (let i = 0; i < courtDeterminationPenalties.length; i++) {
        cy.get(`[data-testid="penalty_${i}"]`).type(
          courtDeterminationPenalties[i].penaltyAmount,
        );
        getButton('Add another penalty').click();
      }
      getButton('Calculate and Save').click();

      getButton('Save').click();
    }
  });

  it('should show deficiency statistics in the correct order', function () {
    const sortedStatistics = getDeficiencyStatistics(this.docketNumber).sort(
      (a, b) => (a._sortOrder < b._sortOrder ? -1 : 1),
    );
    const expectedRows = sortedStatistics.map(s => ({
      period: s.year || formatDateString(s.lastDateOfPeriod, FORMATS.MMDDYY),
      notice: formatDollars(s.irsDeficiencyAmount),
      determination: formatDollars(s.determinationDeficiencyAmount),
    }));

    cy.get('[data-testid="statistics-deficiencies-table"]').within(() => {
      cy.get('thead th').should('have.length', 3);
      cy.get('thead th').eq(0).should('contain', 'Year/Period');
      cy.get('thead th').eq(1).should('contain', 'IRS Notice');
      cy.get('thead th').eq(2).should('contain', 'Determination');
      cy.get('tbody tr').should('have.length', sortedStatistics.length);
      cy.get('tbody tr').each(($row, index) => {
        const expected = expectedRows[index];
        cy.wrap($row).within(() => {
          cy.get('td').eq(0).should('contain', expected.period);
          cy.get('td').eq(1).should('contain', expected.notice);
          cy.get('td').eq(2).should('contain', expected.determination);
        });
      });
    });
  });

  it('should show total penalties in the correct order', function () {
    const sortedStatistics = getDeficiencyStatistics(this.docketNumber).sort(
      (a, b) => (a._sortOrder < b._sortOrder ? -1 : 1),
    );
    const expectedRows = sortedStatistics.map(s => ({
      notice: formatDollars(s.irsTotalPenalties),
      determination: formatDollars(s.determinationTotalPenalties),
    }));

    cy.get('[data-testid="statistics-penalties-table"]').within(() => {
      cy.get('thead th').should('have.length', 3);
      cy.get('thead th').eq(0).should('contain', 'IRS Notice');
      cy.get('thead th').eq(1).should('contain', 'Determination');
      cy.get('thead th').eq(2).should('be.empty'); // The third header is intentionally empty.
      cy.get('tbody tr').should('have.length', sortedStatistics.length);
      cy.get('tbody tr').each(($row, index) => {
        const expected = expectedRows[index];
        cy.wrap($row).within(() => {
          cy.get('td').eq(0).should('contain', expected.notice);
          cy.get('td').eq(1).should('contain', expected.determination);
        });
      });
    });
  });

  it('should show itemized penalties in the correct order', function () {
    const sortedStatistics = getDeficiencyStatistics(this.docketNumber).sort(
      (a, b) => (a._sortOrder < b._sortOrder ? -1 : 1),
    );
    const statisticIndex = sortedStatistics.findIndex(
      s => s.statisticId === 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
    )!;
    const statistic = sortedStatistics[statisticIndex];
    const irsPenalties = statistic.penalties.filter(
      (p: Penalty) => p.penaltyType === PENALTY_TYPES.IRS_PENALTY_AMOUNT,
    );
    const courtDeterminedPenalties = statistic.penalties.filter(
      (p: Penalty) =>
        p.penaltyType === PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
    );
    const rowsCount = Math.max(
      irsPenalties.length,
      courtDeterminedPenalties.length,
    );
    const expectedRows: {
      label: string;
      notice: string;
      determination: string;
    }[] = [];

    for (let i = 0; i < rowsCount; i++) {
      expectedRows.push({
        label: `Penalty ${i + 1}`,
        notice: irsPenalties[i]
          ? formatDollars(irsPenalties[i].penaltyAmount)
          : '',
        determination: courtDeterminedPenalties[i]
          ? formatDollars(courtDeterminedPenalties[i].penaltyAmount)
          : '',
      });
    }
    expectedRows.push({
      label: 'Total:',
      notice: formatDollars(statistic.irsTotalPenalties),
      determination: formatDollars(statistic.determinationTotalPenalties),
    });

    cy.get(
      `[data-testid="view-itemized-penalties-button-${statisticIndex}"]`,
    ).click();
    cy.get('[data-testid="itemized-penalties-modal"]').within(() => {
      cy.get('thead th').should('have.length', 3);
      cy.get('tbody tr').should('have.length', statistic.penalties.length);

      cy.get('tbody tr').each(($row, index) => {
        const expected = expectedRows[index];
        cy.wrap($row).within(() => {
          cy.get('td').eq(0).should('contain', expected.label);
          cy.get('td').eq(1).should('contain', expected.notice);
          cy.get('td').eq(2).should('contain', expected.determination);
        });
      });
    });
  });
});
