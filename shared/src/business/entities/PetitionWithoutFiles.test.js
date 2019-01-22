const PetitionWithoutFiles = require('./PetitionWithoutFiles');

describe('WorkItem', () => {
  describe('isValid', () => {
    it('assigns a new irsNoticeDate if one is not passed in', () => {
      const workItem = new PetitionWithoutFiles({
        caseType: 'other',
        procedureType: 'Small',
        preferredTrialCity: 'Chattanooga, TN',
        irsNoticeDate: null,
      });
      expect(workItem.isValid()).toEqual(true);
    });
  });
});
