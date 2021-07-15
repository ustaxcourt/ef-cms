import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkAddsDocketEntryFromOrder = cerebralTest => {
  return it('Petitions Clerk adds a docket entry from the given order', async () => {
    let helper;

    helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: cerebralTest.getState(),
    });

    const { docketEntryId } = cerebralTest;

    const draftOrderDocument = helper.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    const judges = cerebralTest.getState('judges');
    expect(judges.length).toBeGreaterThan(0);

    const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
    expect(legacyJudge).toBeFalsy();

    expect(cerebralTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(cerebralTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'serviceStamp',
        value: 'Served',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const newDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
