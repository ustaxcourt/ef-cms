const { getIndexNameForDaysAgo } = require('./index');

describe('getIndexNameForDaysago', function () {
  it('should figure out the name of the index from 90 days ago', () => {
    const res = getIndexNameForDaysAgo(90);
    expect(res).toMatch(/^cwl-\d{4}\.\d{2}\.\d{2}$/);
  });
});
