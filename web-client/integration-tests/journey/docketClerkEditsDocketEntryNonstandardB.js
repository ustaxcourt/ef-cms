import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardB = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard B scenario', async () => {
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

    const { documentId } = caseDetailFormatted.formattedDocketEntries[0];
    expect(documentId).toBeDefined();

    const docketEntriesBefore =
      caseDetailFormatted.formattedDocketEntries.length;

    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('documentId')).toEqual(documentId);

    expect(test.getState('form.lodged')).toEqual(false);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OBJ',
    });

    await test.runSequence('submitDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Some free text',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'lodged',
      value: true,
    });

    await test.runSequence('submitDocketEntrySequence');

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
      description: 'Objection Some free text',
    });

    const updatedDocument = caseDetailFormatted.documents.find(
      document => document.documentId === documentId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Objection Some free text',
      documentType: 'Objection [anything]',
      eventCode: 'OBJ',
      lodged: true,
    });
  });
};
