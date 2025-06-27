import { CaseDeadline } from './CaseDeadline';

describe('CaseDeadline', () => {
  const DOCKET_NUMBER = '123-19';

  it('should generate a sortable docket number using the docket number provided', () => {
    const caseDeadline = new CaseDeadline({
      associatedJudge: 'Judge Buch',
      associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'One small step',
      docketNumber: DOCKET_NUMBER,
      sortableDocketNumber: undefined,
    });

    expect(caseDeadline.sortableDocketNumber).toEqual(2019000123);
  });

  it('should create a valid Deadline', () => {
    const caseDeadline = new CaseDeadline({
      associatedJudge: 'Judge Buch',
      associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'One small step',
      consolidatedCaseDeadlineId: 'dabbad02-18d0-43ec-bafb-654e83405416',
      docketNumber: DOCKET_NUMBER,
      sortableDocketNumber: undefined,
    });

    const errors = caseDeadline.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('validation', () => {
    it('should be invalid when required fields that are not defaulted in the constructor are not provided', () => {
      const caseDeadline = new CaseDeadline({});

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
      const caseDeadline = new CaseDeadline({
        associatedJudge: 'Judge Buch',
        associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: 'One small step',
        docketNumber: DOCKET_NUMBER,
        leadDocketNumber: DOCKET_NUMBER,
      });

      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all required fields are present and optional fields are not', () => {
      const caseDeadline = new CaseDeadline({
        associatedJudge: 'Judge Buch',
        associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: 'One small step',
        docketNumber: DOCKET_NUMBER,
        leadDocketNumber: undefined, /// Optional property
      });

      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid and return a helpful message when the user provides a description that is too long', () => {
      const caseDeadline = new CaseDeadline({
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
      });

      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        description:
          'The description is too long. Please enter a valid description.',
      });
    });

    it('should be invalid and return a helpful message when the user provides a consolidated deadline id that is not a GUID', () => {
      const caseDeadline = new CaseDeadline({
        associatedJudge: 'Judge Buch',
        associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
        deadlineDate: '2019-03-01T21:42:29.073Z',
        description: `some description`,
        consolidatedCaseDeadlineId: 'NOT A GUID',
        docketNumber: DOCKET_NUMBER,
      });

      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        consolidatedCaseDeadlineId:
          '"consolidatedCaseDeadlineId" must be a valid GUID',
      });
    });
  });
});
