import { formatJudgeName, getJudgeLastName } from './getFormattedJudgeName';

describe('formatJudgeName', () => {
  it("should remove 'Judge' title from name", () => {
    const result = formatJudgeName('Judge Rummy');

    expect(result).toMatch('Rummy');
  });

  it('returns an empty string for undefined values', () => {
    const result = formatJudgeName(undefined);

    expect(result).toEqual('');
  });
});

describe('getJudgeLastName', () => {
  it("should remove 'Judge' title from name and only return the judge's last name", () => {
    const result = getJudgeLastName('Judge Gertrude H. W. Rummy');

    expect(result).toMatch('Rummy');
  });

  it("should discard suffixes from name and only return the judge's last name", () => {
    const result = getJudgeLastName('Chief Judge Abigail Van Buren Esq. Jr.');

    expect(result).toMatch('Van Buren');
  });
});
