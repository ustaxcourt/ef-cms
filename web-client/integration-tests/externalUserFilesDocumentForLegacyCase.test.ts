import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase';
import { fakeFile, loginAs, setupTest } from './helpers';
import { userTriesToFileAnUnavailableDocumentType } from './journey/userTriesToFileAnUnavailableDocumentType';
import { withAppContextDecorator } from '@web-client/withAppContext';
import { confirmPaperServiceModalHelper } from '@web-client/presenter/computeds/confirmPaperServiceModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { getOtherFilers } from '@shared/business/entities/cases/Case';
import { CONTACT_TYPE_TITLES } from '@shared/business/entities/EntityConstants';

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

    const otherFiler = {
      name: otherFilers[0].name,
      formattedContactType: CONTACT_TYPE_TITLES[otherFilers[0].contactType],
      docketNumber: cerebralTest.docketNumber,
    };

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
      withAppContextDecorator(confirmPaperServiceModalHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(showModal).toEqual('PaperServiceConfirmModal');
    expect(modalHelper.contactsNeedingPaperService![0]).toEqual(otherFiler);
  });
});
