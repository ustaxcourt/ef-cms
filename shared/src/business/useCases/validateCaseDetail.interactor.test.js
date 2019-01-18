const { validateCaseDetail } = require('./validateCaseDetail.interactor');
const Case = require('../entities/Case');
const { omit } = require('lodash');
const moment = require('moment');

describe('validate case detail', () => {
  it('returns the expected errors object on an empty case', () => {
    const errors = validateCaseDetail({
      caseDetail: {},
    });
    expect(errors).toBeTruthy();
  });

  // it('returns the expected errors object when caseType is defined', () => {
  //   const errors = validatePetition({
  //     petition: {
  //       caseType: 'defined',
  //     },
  //     applicationContext: {
  //       getEntityConstructors: () => ({
  //         Petition,
  //       }),
  //     },
  //   });
  //   expect(errors).toEqual(omit(Petition.errorToMessageMap, ['caseType']));
  // });
  //
  // it('returns the expected errors object', () => {
  //   const errors = validatePetition({
  //     petition: {
  //       caseType: 'defined',
  //       procedureType: 'defined',
  //       petitionFile: new File([], 'test.png'),
  //       preferredTrialCity: 'defined',
  //       irsNoticeDate: new Date().toISOString(),
  //       signature: true,
  //     },
  //     applicationContext: {
  //       getEntityConstructors: () => ({
  //         Petition,
  //       }),
  //     },
  //   });
  //   expect(errors).toEqual(null);
  // });
  //
  // it('returns an error for a irs notice date in the future', () => {
  //   const futureDate = moment().add(1, 'days');
  //
  //   const errors = validatePetition({
  //     petition: {
  //       caseType: 'defined',
  //       procedureType: 'defined',
  //       petitionFile: new File([], 'test.png'),
  //       preferredTrialCity: 'defined',
  //       irsNoticeDate: futureDate.toDate().toISOString(),
  //       signature: true,
  //     },
  //     applicationContext: {
  //       getEntityConstructors: () => ({
  //         Petition,
  //       }),
  //     },
  //   });
  //
  //   expect(errors).toEqual({
  //     irsNoticeDate: 'IRS Notice Date is a required field.',
  //   });
  // });
});
