import { getPetitionDocumentForCase } from '../helpers';

export default (test, overrides = {}) => {
  return it('Petitions clerk updates filed by', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const petitionDocument = getPetitionDocumentForCase(
      test.getState('caseDetail'),
    );

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: petitionDocument.documentId,
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: overrides.receivedAtMonth,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: overrides.receivedAtDay,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: overrides.receivedAtYear,
    });

    await test.runSequence('saveSavedCaseForLaterSequence');
    await test.runSequence('navigateToPathSequence', {
      path: `/case-detail/${test.docketNumber}`,
    });

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.receivedAt')).toEqual(
      `${overrides.receivedAtYear}-${overrides.receivedAtMonth}-${overrides.receivedAtDay}T05:00:00.000Z`,
    );
  });
};
