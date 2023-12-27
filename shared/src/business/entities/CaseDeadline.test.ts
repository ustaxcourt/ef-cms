import { CaseDeadline } from './CaseDeadline';
import { applicationContext } from '../test/createTestApplicationContext';

describe('CaseDeadline', () => {
  const DOCKET_NUMBER = '123-19';

  it('should generate a sortable docket number using the docket number provided', () => {
    const caseDeadline = new CaseDeadline(
      {
        associatedJudge: 'Judge Buch',
        associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: 'One small step',
        docketNumber: DOCKET_NUMBER,
        sortableDocketNumber: undefined,
      },
      { applicationContext },
    );

    expect(caseDeadline.sortableDocketNumber).toEqual(2019000123);
  });

  describe('constructor', () => {
    it('should throw an error when application context is not provided', () => {
      expect(
        () =>
          new CaseDeadline(
            {
              associatedJudge: 'Judge Buch',
              associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
              deadlineDate: '2019-03-01T21:42:29.073Z',
              description: 'One small step',
              docketNumber: DOCKET_NUMBER,
              sortableDocketNumber: undefined,
            },
            {} as any,
          ),
      ).toThrow('applicationContext must be defined');
    });
  });

  describe('validation', () => {
    it.skip('should be invalid when required fields that are not defaulted in the constructor are not provided', () => {
      const caseDeadline = new CaseDeadline({}, { applicationContext });

      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        associatedJudge: 'Associated judge is required',
        associatedJudgeId: '"associatedJudgeId" is required',
        deadlineDate: 'Enter a valid deadline date',
        description: 'Enter a description of this deadline',
        docketNumber: 'You must have a docket number.',
        sortableDocketNumber: 'Sortable docket number is required',
      });
    });

    it('should be valid when required fields are all provided', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
          docketNumber: DOCKET_NUMBER,
          leadDocketNumber: DOCKET_NUMBER,
        },
        { applicationContext },
      );

      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all required fields are present and optional fields are not', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
          docketNumber: DOCKET_NUMBER,
          leadDocketNumber: undefined, /// Optional property
        },
        { applicationContext },
      );

      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid and return a helpful message when the user provides a description that is too long', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: `I got the horses in the back
            Horse tack is attached
            Hat is matte black
            Got the boots that's black to match
            Ridin' on a horse, ha
            You can whip your Porsche
            I been in the valley
            You ain't been up off that porch, now`, // Description can be at most 120 characters
          docketNumber: DOCKET_NUMBER,
        },
        { applicationContext },
      );

      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        description:
          'The description is too long. Please enter a valid description.',
      });
    });
  });
});
