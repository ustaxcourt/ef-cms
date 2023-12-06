import {
  ADVANCED_SEARCH_TABS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import {
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('SPTO/SPOS requires a judge', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Seed data SPTO - without judge', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');

    it('tries to edit an existing SPTO and save without setting the judge', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '102-67',
      });

      const { docketEntries } = cerebralTest.getState('caseDetail');
      const spto = docketEntries.find(doc => doc.eventCode === 'SPTO');

      await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
        docketEntryId: spto.docketEntryId,
        docketNumber: '102-67',
      });

      expect(cerebralTest.getState('form.judge')).toBeUndefined();

      await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        judge: 'Select a judge',
      });
    });
  });

  describe('Create new SPTO', () => {
    it('Create case', async () => {
      const { docketNumber } = await uploadPetition(cerebralTest);

      expect(docketNumber).toBeDefined();

      cerebralTest.docketNumber = docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);

    it('docket clerk adds SPTO from the draft', async () => {
      await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
        docketEntryId: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'eventCode',
          value:
            SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'documentType',
          value:
            SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentType,
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'scenario',
          value: 'Type B',
        },
      );

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'documentTitle',
          value:
            SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentTitle,
        },
      );

      await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        judge: 'Select a judge',
      });

      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'judge',
          value: 'Cohen',
        },
      );

      await cerebralTest.runSequence(
        'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
      );

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('alertSuccess.message') === 'Document Served.',
      });

      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const caseDetailFormatted = await runCompute(
        withAppContextDecorator(formattedCaseDetail),
        {
          state: cerebralTest.getState(),
        },
      );

      const updatedDocument = caseDetailFormatted.formattedDocketEntries.find(
        doc => doc.docketEntryId === cerebralTest.docketEntryId,
      );

      expect(updatedDocument).toBeDefined();
    });

    it('should display judge name as part of Standing Pretrial order search results', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');

      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          judge: 'Cohen',
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.docketEntryId,
            docketNumber: cerebralTest.docketNumber,
            eventCode: 'SPTO',
            judge: 'Cohen',
          }),
        ]),
      );
    });
  });
});
