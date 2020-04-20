const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('./cases/Case');
const { CaseDeadline } = require('./CaseDeadline');

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

const UUID = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
describe('CaseDeadline', () => {
  beforeAll(() => {
    applicationContext.getUniqueId = jest.fn().mockReturnValue(UUID);
  });

  describe('validation', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new CaseDeadline({}, {})).toThrow(TypeError);
    });

    it('should have error messages for missing fields', () => {
      const caseDeadline = new CaseDeadline({}, { applicationContext });
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        caseId: VALIDATION_ERROR_MESSAGES.caseId,
        caseTitle: VALIDATION_ERROR_MESSAGES.caseTitle,
        deadlineDate: VALIDATION_ERROR_MESSAGES.deadlineDate,
        description: VALIDATION_ERROR_MESSAGES.description[1],
        docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
      });
    });

    it('should be valid when all fields are present', () => {
      const caseDeadline = new CaseDeadline(
        {
          caseId: UUID,
          caseTitle: 'My Case Title',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
          docketNumber: '101-21',
          docketNumberSuffix: 'L',
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should have error messages for invalid fields', () => {
      const caseDeadline = new CaseDeadline(
        {
          caseId: UUID,
          caseTitle: 'My Case Title',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: `I got the horses in the back
Horse tack is attached
Hat is matte black
Got the boots that's black to match
Ridin' on a horse, ha
You can whip your Porsche
I been in the valley
You ain't been up off that porch, now`,
          docketNumber: '101-21',
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        description: VALIDATION_ERROR_MESSAGES.description[0].message,
      });
    });

    it('should use associated judge if one is provided', () => {
      const mockJudgeName = 'Dumbledore';
      const caseDeadlineWithJudge = new CaseDeadline(
        {
          associatedJudge: mockJudgeName,
          caseId: UUID,
          caseTitle: 'My Case Title',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
        },
        { applicationContext },
      );

      expect(caseDeadlineWithJudge.associatedJudge).toEqual(mockJudgeName);
    });

    it('should use default judge if one is not provided', () => {
      const caseDeadlineWithoutJudge = new CaseDeadline(
        {
          caseId: UUID,
          caseTitle: 'My Case Title',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
        },
        { applicationContext },
      );

      expect(caseDeadlineWithoutJudge.associatedJudge).toEqual(
        Case.CHIEF_JUDGE,
      );
    });
  });
});
