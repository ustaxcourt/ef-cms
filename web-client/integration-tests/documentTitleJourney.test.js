import { completeDocumentTypeSectionHelper as completeDocumentTypeSectionHelperComputed } from '../src/presenter/computeds/completeDocumentTypeSectionHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../src/presenter/computeds/formattedWorkQueue';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Document title journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const cerebralTest = setupTest();

  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  const completeDocumentTypeSectionHelper = withAppContextDecorator(
    completeDocumentTypeSectionHelperComputed,
  );

  loginAs(cerebralTest, 'privatePractitioner2@example.com');
  practitionerCreatesNewCase(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner2@example.com');
  it('Practitioner files Exhibit(s) document', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Exhibit(s)',
      documentType: 'Exhibit(s)',
      eventCode: 'EXH',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual('Exhibit(s)');

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'hasSupportingDocuments',
        value: false,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'attachments',
        value: false,
      },
    );

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket clerk QCs Exhibits docket entry and adds additionalInfo', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const exhibitDocketEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.eventCode === 'EXH');

    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: exhibitDocketEntry.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo',
      value: 'Is this pool safe for diving? It deep ends.',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'addToCoversheet',
      value: true,
    });

    await cerebralTest.runSequence('completeDocketEntryQCSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Exhibit(s) Is this pool safe for diving? It deep ends. has been completed.',
    );

    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });
    const exhibitOutboxWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId === exhibitDocketEntry.docketEntryId,
    );
    cerebralTest.docketEntryId = exhibitDocketEntry.docketEntryId;

    expect(exhibitOutboxWorkItem.docketEntry.descriptionDisplay).toEqual(
      'Exhibit(s) Is this pool safe for diving? It deep ends.',
    );
  });

  loginAs(cerebralTest, 'privatePractitioner2@example.com');
  it('Practitioner files amendment to Exhibit(s) document', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: '[First, Second, etc.] Amendment to [anything]',
      documentType: 'Amendment [anything]',
      eventCode: 'ADMT',
      filers: [contactPrimary.contactId],
      ordinalValue: 'First',
      primaryDocumentFile: fakeFile,
      scenario: 'Nonstandard F',
    };

    for (const key of Object.keys(documentToSelect)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    cerebralTest.setState('docketEntryId', undefined);

    const completeDocumentTypeSection = runCompute(
      completeDocumentTypeSectionHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(
      completeDocumentTypeSection.primary.previouslyFiledDocuments.find(
        d => d.eventCode === 'EXH',
      ).documentTitle,
    ).toEqual('Exhibit(s) Is this pool safe for diving? It deep ends.');

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'previousDocument',
        value: cerebralTest.docketEntryId,
      },
    );

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('form.documentTitle')).toEqual(
      'First Amendment to Exhibit(s) Is this pool safe for diving? It deep ends.',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
});
