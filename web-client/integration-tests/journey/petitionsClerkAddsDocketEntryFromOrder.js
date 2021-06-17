import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkAddsDocketEntryFromOrder = test => {
  return it('Petitions Clerk adds a docket entry from the given order', async () => {
    let helper;

    helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const { docketEntryId } = test;

    const draftOrderDocument = helper.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: test.docketNumber,
    });

    const judges = test.getState('judges');
    expect(judges.length).toBeGreaterThan(0);

    const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
    expect(legacyJudge).toBeFalsy();

    expect(test.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(test.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'serviceStamp',
      value: 'Served',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const newDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
