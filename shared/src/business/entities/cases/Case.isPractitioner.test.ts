import { Case } from './Case';
import { MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('isPractitioner', () => {
  it('returns true if the contactId is a privatePractitioner on the case', () => {
    const caseRecord = new Case(
      {
        ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      },
      {
        applicationContext,
      },
    );
    expect(
      caseRecord.isPractitioner('020374b7-b274-462b-8a16-65783147efa9'),
    ).toEqual(true);
  });

  it('returns true if the contactId is a irsPractitioner on the case', () => {
    const caseRecord = new Case(
      {
        ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      },
      {
        applicationContext,
      },
    );
    expect(
      caseRecord.isPractitioner('3bcd5fb7-434e-4354-aa08-1d10846c1867'),
    ).toEqual(true);
  });

  it('returns false if the contactId is not any form of practitioner', () => {
    const caseRecord = new Case(
      {
        ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      },
      {
        applicationContext,
      },
    );
    expect(
      caseRecord.isPractitioner('2bcd5fb7-434e-4354-aa08-1d10846c1867'),
    ).toEqual(false);
  });
});
