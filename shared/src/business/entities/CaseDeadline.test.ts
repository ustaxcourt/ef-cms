import { CaseDeadline } from './CaseDeadline';
import { applicationContext } from '../test/createTestApplicationContext';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

const DOCKET_NUMBER = '123-19';
describe('CaseDeadline', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const caseDeadline = new CaseDeadline({}, { applicationContext });
      const customMessages = extractCustomMessages(
        caseDeadline.getValidationRules(),
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        associatedJudge: customMessages.associatedJudge[0],
        deadlineDate: customMessages.deadlineDate[0],
        description: customMessages.description[0],
        docketNumber: customMessages.docketNumber[0],
        sortableDocketNumber: customMessages.sortableDocketNumber[0],
      });
    });

    it('should be valid when all fields are present', () => {
      const caseDeadline = new CaseDeadline(
        {
          associatedJudge: 'Judge Buch',
          deadlineDate: '2019-03-01T21:42:29.073Z',
          description: 'One small step',
          docketNumber: DOCKET_NUMBER,
          leadDocketNumber: DOCKET_NUMBER,
        },
        { applicationContext },
      );
      expect(caseDeadline.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all fields are present except for leadDocketNumber', () => {
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
      const customMessages = extractCustomMessages(
        caseDeadline.getValidationRules(),
      );

      expect(caseDeadline.getFormattedValidationErrors()).toEqual({
        description: customMessages.description[1],
      });
    });
  });
});
