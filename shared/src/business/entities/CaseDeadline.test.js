const { CaseDeadline } = require('./CaseDeadline');

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

describe('CaseDeadline', () => {
  let applicationContext;

  beforeAll(() => {
    applicationContext = {
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
  });

  describe('validation', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new CaseDeadline({}, {})).toThrow(TypeError);
    });

    it('should have error messages for missing fields', () => {
      const caseDeadline = new CaseDeadline({}, { applicationContext });
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        caseId: VALIDATION_ERROR_MESSAGES.caseId,
        deadlineDate: VALIDATION_ERROR_MESSAGES.deadlineDate,
        description: VALIDATION_ERROR_MESSAGES.description[1],
      });
    });

    it('should be valid when all fields are present', () => {
      const caseDeadline = new CaseDeadline(
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should have error messages for invalid fields', () => {
      const caseDeadline = new CaseDeadline(
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: `I got the horses in the back
Horse tack is attached
Hat is matte black
Got the boots that's black to match
Ridin' on a horse, ha
You can whip your Porsche
I been in the valley
You ain't been up off that porch, now`,
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        description: VALIDATION_ERROR_MESSAGES.description[0].message,
      });
    });
  });
});
