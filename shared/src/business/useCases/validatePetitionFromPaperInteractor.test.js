const {
  validatePetitionFromPaper,
} = require('./validatePetitionFromPaperInteractor');
const { CaseInternal } = require('../entities/CaseInternal');
const { omit } = require('lodash');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaper({
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
          'caseType',
          'irsNoticeDate',
          'ownershipDisclosureFile',
          'petitionFileSize',
          'stinFileSize',
        ]),
      ),
    );
  });
});
