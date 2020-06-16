import { formatJudgeName, getJudgeLastName } from './getFormattedJudgeName';

describe('formatJudgeName', () => {
  it("should remove 'Judge' title from name", () => {
    const result = formatJudgeName('Judge Rummy');

    expect(result).toMatch('Rummy');
  });
});

describe('getJudgeLastName', () => {
  it("should remove 'Judge' title from name and only return the judge's last name", () => {
    const result = getJudgeLastName('Judge Gertrude H. W. Rummy');

    expect(result).toMatch('Rummy');
  });
});
