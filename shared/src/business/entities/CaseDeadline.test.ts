const { applicationContext } = require('../test/createTestApplicationContext');
const { CaseDeadline } = require('./CaseDeadline');

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

const DOCKET_NUMBER = '123-19';
describe('CaseDeadline', () => {
  describe('validation', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new CaseDeadline({}, {})).toThrow(TypeError);
    });

    it('should have error messages for missing fields', () => {
      const caseDeadline = new CaseDeadline({}, { applicationContext });
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        associatedJudge: VALIDATION_ERROR_MESSAGES.associatedJudge,
        deadlineDate: VALIDATION_ERROR_MESSAGES.deadlineDate,
        description: VALIDATION_ERROR_MESSAGES.description[1],
        docketNumber: VALIDATION_ERROR_MESSAGES.docketNumber,
        sortableDocketNumber: VALIDATION_ERROR_MESSAGES.sortableDocketNumber,
      });
    });

    it('should be valid when all fields are present', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
          docketNumber: DOCKET_NUMBER,
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should generate a sortableDocketNumber from the docketNumber passed in', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
          docketNumber: DOCKET_NUMBER,
        },
        { applicationContext },
      );
      expect(caseDeadline.sortableDocketNumber).toEqual(2019000123);
    });

    it('should have error messages for invalid fields', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: `I got the horses in the back
Horse tack is attached
Hat is matte black
Got the boots that's black to match
Ridin' on a horse, ha
You can whip your Porsche
I been in the valley
You ain't been up off that porch, now`,
          docketNumber: DOCKET_NUMBER,
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        description: VALIDATION_ERROR_MESSAGES.description[0].message,
      });
    });
  });
});
