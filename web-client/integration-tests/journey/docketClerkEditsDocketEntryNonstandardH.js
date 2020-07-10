import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { getPetitionDocumentForCase } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardH = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard H scenario', async () => {
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
    const petitionDocument = getPetitionDocumentForCase(
      test.getState('caseDetail'),
    );
    expect(documentId).toBeDefined();
    expect(petitionDocument.documentId).toBeDefined();

    const docketEntriesBefore =
      caseDetailFormatted.formattedDocketEntries.length;

    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('documentId')).toEqual(documentId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'M115',
    });

    await test.runSequence('saveForLaterDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      secondaryDocument: VALIDATION_ERROR_MESSAGES.secondaryDocument,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: 'Yes',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'AMAT',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.ordinalValue',
      value: 'First',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.previousDocument',
      value: petitionDocument.documentId,
    });

    await test.runSequence('saveForLaterDocketEntrySequence');

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
      description:
        'Motion for Leave to File First Amended Petition some additional info',
    });

    const updatedDocument = caseDetailFormatted.documents.find(
      document => document.documentId === documentId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Motion for Leave to File First Amended Petition',
      documentType: 'Motion for Leave to File',
      eventCode: 'MISCL',
    });
  });
};
