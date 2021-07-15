const { refreshElasticsearchIndex } = require('../helpers');

export const admissionsClerkEditsPractitionerInfo = cerebralTest => {
  return it('admissions clerk edits practitioner information', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: cerebralTest.barNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );
    expect(cerebralTest.getState('form.barNumber')).toEqual(
      cerebralTest.barNumber,
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'firstName',
      value: 'Ben',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'middleName',
      value: 'Leighton',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'lastName',
      value: 'Matlock',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Legal Way',
    });

    await cerebralTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex(5000);

    expect(cerebralTest.getState('currentPage')).toEqual('PractitionerDetail');
    expect(cerebralTest.getState('practitionerDetail.barNumber')).toEqual(
      cerebralTest.barNumber,
    );
    expect(cerebralTest.getState('practitionerDetail.name')).toEqual(
      'Ben Leighton Matlock',
    );
    expect(
      cerebralTest.getState('practitionerDetail.contact.address1'),
    ).toEqual('123 Legal Way');

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const caseDetail = cerebralTest.getState('caseDetail');
    const noticeDocument = caseDetail.docketEntries.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(noticeDocument).toBeTruthy();
    expect(noticeDocument.additionalInfo).toEqual('for Ben Leighton Matlock');
  });
};
