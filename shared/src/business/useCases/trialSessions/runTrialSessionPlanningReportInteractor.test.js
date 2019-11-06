const sinon = require('sinon');
const {
  compareISODateStrings,
  compareStrings,
} = require('../../utilities/sortFunctions');
const {
  getPreviousTerm,
  getTrialSessionPlanningReportData,
  runTrialSessionPlanningReportInteractor,
} = require('./runTrialSessionPlanningReportInteractor');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { User } = require('../../entities/User');

describe('run trial session planning report', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          getEligibleCasesForTrialCity: sinon.stub().returns([]),
        };
      },
      getUtilities: () => {
        return { compareISODateStrings, compareStrings };
      },
    };
    await expect(
      runTrialSessionPlanningReportInteractor({
        applicationContext,
        term: 'winter',
        year: '2020',
      }),
    ).rejects.toThrow();
  });

  it('returns the created pdf', async () => {
    const generateTrialSessionPlanningReportTemplateStub = sinon.stub();
    const generatePdfFromHtmlInteractorStub = sinon.stub();
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getEligibleCasesForTrialCity: sinon
            .stub()
            .returns([{ caseId: '123' }]),
          getTrialSessions: sinon.stub().returns([
            {
              judge: { name: 'Judge Armen' },
              sessionType: 'Regular',
              startDate: '2020-05-01T21:40:46.415Z',
              term: 'spring',
              termYear: '2020',
              trialLocation: 'Birmingham, Alabama',
              trialSessionId: '123',
            },
          ]),
        };
      },
      getTemplateGenerators: () => {
        return {
          generateTrialSessionPlanningReportTemplate: ({
            previousTerms,
            rows,
            selectedTerm,
            selectedYear,
          }) => {
            generateTrialSessionPlanningReportTemplateStub();
            return `<!DOCTYPE html>${previousTerms} ${rows} ${selectedTerm} ${selectedYear}</html>`;
          },
        };
      },
      getUseCases: () => {
        return {
          generatePdfFromHtmlInteractor: ({ contentHtml }) => {
            generatePdfFromHtmlInteractorStub();
            return contentHtml;
          },
        };
      },
      getUtilities: () => {
        return { compareISODateStrings, compareStrings };
      },
    };

    const result = await runTrialSessionPlanningReportInteractor({
      applicationContext,
      term: 'winter',
      year: '2020',
    });

    expect(generateTrialSessionPlanningReportTemplateStub.called).toEqual(true);
    expect(generatePdfFromHtmlInteractorStub.called).toEqual(true);
    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
  });

  describe('getTrialSessionPlanningReportData', () => {
    it('returns previous terms and the trial locations and case counts', async () => {
      const getEligibleCasesForTrialCityStub = sinon
        .stub()
        .returns([{ caseId: '123' }, { caseId: '123' }]);
      const getTrialSessionsStub = sinon.stub().returns([
        {
          judge: { name: 'Judge Armen' },
          sessionType: 'Regular',
          startDate: '2019-05-01T21:40:46.415Z',
          term: 'spring',
          termYear: '2019',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '123',
        },
        {
          judge: { name: 'Judge Buch' },
          sessionType: 'Small',
          startDate: '2019-04-01T21:40:46.415Z',
          term: 'spring',
          termYear: '2019',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '234',
        },
        {
          //judge is missing, so this one should not show up in the list
          sessionType: 'Small',
          startDate: '2019-06-01T21:40:46.415Z',
          term: 'spring',
          termYear: '2019',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '234',
        },
        {
          judge: { name: 'Judge Ashford' },
          sessionType: 'Small',
          startDate: '2019-09-01T21:40:46.415Z',
          term: 'fall',
          termYear: '2019',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '345',
        },
        {
          judge: { name: 'Judge Ashford' },
          sessionType: 'Special',
          startDate: '2019-10-01T21:40:46.415Z',
          term: 'fall',
          termYear: '2019',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '456',
        },
      ]);
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: User.ROLES.petitionsClerk,
            userId: 'petitionsClerk',
          };
        },
        getPersistenceGateway: () => {
          return {
            getEligibleCasesForTrialCity: getEligibleCasesForTrialCityStub,
            getTrialSessions: getTrialSessionsStub,
          };
        },
        getUtilities: () => {
          return { compareISODateStrings, compareStrings };
        },
      };
      const results = await getTrialSessionPlanningReportData({
        applicationContext,
        term: 'winter',
        year: '2020',
      });

      expect(results.previousTerms).toMatchObject([
        { term: 'fall', year: '2019' },
        { term: 'spring', year: '2019' },
        { term: 'winter', year: '2019' },
      ]);
      expect(results.trialLocationData.length).toEqual(
        TrialSession.TRIAL_CITIES.ALL.length,
      );
      expect(results.trialLocationData[0]).toMatchObject({
        allCaseCount: 4,
        previousTermsData: [['(S) Ashford'], ['(S) Buch', '(R) Armen'], []],
        regularCaseCount: 2,
        smallCaseCount: 2,
        stateAbbreviation: 'AL',
        trialCityState: 'Birmingham, Alabama',
      });
    });
  });

  describe('get previous term', () => {
    it('returns previous term and previous year if the previous term is winter', () => {
      const result = getPreviousTerm('winter', '2020');
      expect(result).toEqual({ term: 'fall', year: '2019' });
    });
    it('returns previous term and same year if the previous term is fall', () => {
      const result = getPreviousTerm('fall', '2020');
      expect(result).toEqual({ term: 'spring', year: '2020' });
    });
    it('returns previous term and same year if the previous term is spring', () => {
      const result = getPreviousTerm('spring', '2020');
      expect(result).toEqual({ term: 'winter', year: '2020' });
    });
  });
});
