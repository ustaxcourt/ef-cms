import { contactPrimaryFromState, fakeFile } from '../helpers';

export const docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater =
  (cerebralTest, eventCode) => {
    const answerFilingOptions = [
      {
        key: 'dateReceivedMonth',
        value: 4,
      },
      {
        key: 'dateReceivedDay',
        value: 30,
      },
      {
        key: 'dateReceivedYear',
        value: 2001,
      },
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
      {
        key: 'primaryDocumentFileSize',
        value: 100,
      },
      {
        key: 'eventCode',
        value: eventCode,
      },
    ];

    return it('Docket clerk adds paper filed multi-docketable document and saves for later', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.leadDocketNumber,
      });

      await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
        docketNumber: cerebralTest.leadDocketNumber,
      });

      for (const option of answerFilingOptions) {
        await cerebralTest.runSequence(
          'updateDocketEntryFormValueSequence',
          option,
        );
      }

      const contactPrimary = contactPrimaryFromState(cerebralTest);
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: `filersMap.${contactPrimary.contactId}`,
          value: true,
        },
      );

      await cerebralTest.runSequence('openConfirmPaperServiceModalSequence');
      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiateServiceModal',
      );

      await cerebralTest.runSequence('submitPaperFilingSequence', {
        isSavingForLater: true,
      });

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      expect(cerebralTest.getState('consolidatedCaseAllCheckbox')).toBe(true);

      cerebralTest.multiDocketedDocketEntryId = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(doc => doc.eventCode === eventCode).docketEntryId;
    });
  };
