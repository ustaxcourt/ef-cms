import { formatJudgeName } from './getFormattedJudgeName';

describe('formatJudgeName', () => {
  it("should remove 'Judge' title from name", () => {
    const result = formatJudgeName('Judge Rummy');

    expect(result).toMatch('Rummy');
  });
});
