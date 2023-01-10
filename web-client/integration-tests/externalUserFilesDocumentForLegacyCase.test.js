import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase.js';
import { completeDocumentTypeSectionHelper as completeDocumentTypeSectionHelperComputed } from '../src/presenter/computeds/completeDocumentTypeSectionHelper';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase.js';
import { fakeFile, loginAs, setupTest } from './helpers';
import { getOtherFilers } from '../../shared/src/business/entities/cases/Case';
import { withAppContextDecorator } from '../src/withAppContext';

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
  it('they are unable to file a document type of M123', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const completeDocumentTypeSectionHelper = withAppContextDecorator(
      completeDocumentTypeSectionHelperComputed,
    );

    console.log(completeDocumentTypeSectionHelper, '-------');

    const M123_document =
      completeDocumentTypeSectionHelper.documentTypesForSelectSorted.find(
        d => d.eventCode === 'M123',
      );

    expect(M123_document).toBeUndefined();
  });

  // loginAs(cerebralTest, 'privatePractitioner@example.com');
  // associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  // externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);

  // loginAs(cerebralTest, 'irsPractitioner@example.com');
  // associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  // externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);

  // loginAs(cerebralTest, 'docketclerk@example.com');
  // it('verifies otherFiler parties receive paper service when serviceIndicator is set to paper', async () => {
  //   await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //     docketNumber: cerebralTest.docketNumber,
  //   });

  //   const otherFilers = getOtherFilers(cerebralTest.getState('caseDetail'));
  //   const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
  //   const lastServedDocument = docketEntries.pop();

  //   const isOtherFilerServed = lastServedDocument.servedParties.find(
  //     p => p.name === otherFilers[0].name && p.email === otherFilers[0].email,
  //   );

  //   expect(isOtherFilerServed).toBeTruthy();
  // });
});
