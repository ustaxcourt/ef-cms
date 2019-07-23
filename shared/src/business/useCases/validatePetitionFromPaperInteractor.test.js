const {
  validatePetitionFromPaperInteractor,
} = require('./validatePetitionFromPaperInteractor');
const { CaseInternal } = require('../entities/cases/CaseInternal');
const { omit } = require('lodash');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaperInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseInternal,
        }),
      },
      petition: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(
        omit(CaseInternal.errorToMessageMap, [
          'irsNoticeDate',
          'ownershipDisclosureFileSize',
          'petitionFileSize',
          'stinFileSize',
          'requestForPlaceOfTrialFileSize',
        ]),
      ),
    );
  });
});
