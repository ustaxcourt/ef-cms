import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

export default test => {
  return it('Petitions clerk adds Order to case', async () => {
    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'My Awesome Order',
    });

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    const {
      draftDocuments,
    } = applicationContext.getUtilities().getFormattedCaseDetail({
      applicationContext,
      caseDetail: test.getState('caseDetail'),
    });

    test.documentId = first(draftDocuments)
      ? first(draftDocuments).documentId
      : undefined;
  });
};
