const {
  getChambersSections,
  getChambersSectionsLabels,
  getJudgesChambers,
  getJudgesChambersWithLegacy,
} = require('./getJudgesChambers');

describe('getJudgesChambers', () => {
  it('should return a map of judge chambers with labels and sections', () => {
    const result = getJudgesChambers();

    expect(result).toBeDefined();

    const firstKey = Object.keys(result)[0];

    expect(result[firstKey]).toMatchObject({
      label: expect.anything(),
      section: expect.anything(0),
    });
  });

  describe('getJudgesChambersWithLegacy', () => {
    it('should return a map of judge chambers with legacy judge chambers', () => {
      const result = getJudgesChambersWithLegacy();

      expect(result.LEGACY_JUDGES_CHAMBERS_SECTION).toBeDefined();
    });
  });

  describe('getChambersSectionsLabels', () => {
    it('should return an array of chambers section labels', () => {
      const result = getChambersSectionsLabels();

      expect(result.length).toBeDefined();
    });
  });

  describe('getChambersSections', () => {
    it('should return chambers sections sorted by name', () => {
      const result = getChambersSections();

      expect(result.length).toBeDefined();
    });
  });
});
