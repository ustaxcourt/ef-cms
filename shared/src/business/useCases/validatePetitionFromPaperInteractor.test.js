const {
  validatePetitionFromPaper,
} = require('./validatePetitionFromPaperInteractor');
const { omit } = require('lodash');
const { PetitionFromPaper } = require('../entities/PetitionFromPaper');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaper({
      applicationContext: {
        getEntityConstructors: () => ({
          PetitionFromPaper,
        }),
      },
      petition: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(
        omit(PetitionFromPaper.errorToMessageMap, [
          'caseType',
          'irsNoticeDate',
          'ownershipDisclosureFile',
        ]),
      ),
    );
  });
});
