import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase';
import { fakeFile, loginAs, setupTest } from './helpers';
import { userTriesToFileAnUnavailableDocumentType } from './journey/userTriesToFileAnUnavailableDocumentType';
import { withAppContextDecorator } from '@web-client/withAppContext';
import { confirmInitiateServiceModalHelper } from '@web-client/presenter/computeds/confirmInitiateServiceModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { getOtherFilers } from '@shared/business/entities/cases/Case';

describe('an external user files a document for their legacy case', () => {
  const cerebralTest = setupTest();

  const seededDocketNumber = '999-15';

  beforeAll(() => {
    cerebralTest.docketNumber = seededDocketNumber;
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
  userTriesToFileAnUnavailableDocumentType(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
  userTriesToFileAnUnavailableDocumentType(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
  userTriesToFileAnUnavailableDocumentType(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('verifies otherFiler parties receive paper service when serviceIndicator is set to paper', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const lastServedDocument = docketEntries.pop();

    const otherFilers = getOtherFilers(cerebralTest.getState('caseDetail'));

    const otherFilerNameAndTitle = `${otherFilers[0].name}, ${otherFilers[0].title}`;

    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: lastServedDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo',
      value: 'Some additional information',
    });

    await cerebralTest.runSequence('completeDocketEntryQCSequence');

    const showModal = cerebralTest.getState('modal.showModal');

    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiateServiceModalHelper),
      {
        state: cerebralTest.getState(),
      },
    );
    
    expect(showModal).toEqual('PaperServiceConfirmModal');
    expect(modalHelper.contactsNeedingPaperService[0].name).toEqual(otherFilerNameAndTitle);
  });
});
