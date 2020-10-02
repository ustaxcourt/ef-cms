import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryStandard = test => {
  return it('docket clerk edits docket entry with Standard scenario', async () => {
    let caseDetailFormatted;
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { docketEntryId } = caseDetailFormatted.formattedDocketEntries[0];
    expect(docketEntryId).toBeDefined();

    const docketEntriesBefore =
      caseDetailFormatted.formattedDocketEntries.length;

    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('docketEntryId')).toEqual(docketEntryId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'EA',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: '1',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: '1',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: '2050',
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[0].message,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: '2018',
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const docketEntriesAfter =
      caseDetailFormatted.formattedDocketEntries.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = caseDetailFormatted.formattedDocketEntries[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay: 'Entry of Appearance',
    });

    const updatedDocument = caseDetailFormatted.formattedDocketEntries.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Entry of Appearance',
      documentType: 'Entry of Appearance',
      eventCode: 'EA',
      filedBy: 'Petr. Mona Schultz, Brianna Noble',
      partyPrimary: true,
      receivedAt: '2018-01-01',
    });
  });
};
