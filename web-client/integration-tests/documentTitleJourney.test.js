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
    test.closeSocket();
  });

  const test = setupTest();

  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  const completeDocumentTypeSectionHelper = withAppContextDecorator(
    completeDocumentTypeSectionHelperComputed,
  );

  loginAs(test, 'privatePractitioner2@example.com');
  practitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'privatePractitioner2@example.com');
  it('Practitioner files Exhibit(s) document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Exhibit(s)',
      documentType: 'Exhibit(s)',
      eventCode: 'EXH',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await test.runSequence('updateFileDocumentWizardFormValueSequence', {
        key,
        value: documentToSelect[key],
      });
    }

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('form.documentType')).toEqual('Exhibit(s)');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });

  loginAs(test, 'docketclerk@example.com');
  it('Docket clerk QCs Exhibits docket entry and adds additionalInfo', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const exhibitDocketEntry = test
      .getState('caseDetail.docketEntries')
      .find(entry => entry.eventCode === 'EXH');

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: exhibitDocketEntry.docketEntryId,
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo',
      value: 'Is this pool safe for diving? It deep ends.',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'addToCoversheet',
      value: true,
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').message).toEqual(
      'Exhibit(s) Is this pool safe for diving? It deep ends. has been completed.',
    );

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });
    const exhibitOutboxWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId === exhibitDocketEntry.docketEntryId,
    );
    test.docketEntryId = exhibitDocketEntry.docketEntryId;

    expect(exhibitOutboxWorkItem.docketEntry.descriptionDisplay).toEqual(
      'Exhibit(s) Is this pool safe for diving? It deep ends.',
    );
  });

  loginAs(test, 'privatePractitioner2@example.com');
  it('Practitioner files amendment to Exhibit(s) document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);

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
      await test.runSequence('updateFileDocumentWizardFormValueSequence', {
        key,
        value: documentToSelect[key],
      });
    }

    await test.runSequence('validateSelectDocumentTypeSequence');

    await test.runSequence('completeDocumentSelectSequence');

    test.setState('docketEntryId', undefined);

    const completeDocumentTypeSection = runCompute(
      completeDocumentTypeSectionHelper,
      {
        state: test.getState(),
      },
    );

    expect(
      completeDocumentTypeSection.primary.previouslyFiledDocuments.find(
        d => d.eventCode === 'EXH',
      ).documentTitle,
    ).toEqual('Exhibit(s) Is this pool safe for diving? It deep ends.');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'previousDocument',
      value: test.docketEntryId,
    });

    await test.runSequence('completeDocumentSelectSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'First Amendment to Exhibit(s) Is this pool safe for diving? It deep ends.',
    );

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
});
