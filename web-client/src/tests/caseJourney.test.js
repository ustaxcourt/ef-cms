import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';

import presenter from '../presenter';
import applicationContext from '../applicationContext';

import Case from '../../../shared/src/business/entities/Case';

let test;
let docketNumber;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === `/case-detail/${docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', { docketNumber });
    }
  },
};

const fakeFile = new Buffer(['TEST'], {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Case journey', async () => {
  it('Taxpayer logs in', async () => {
    test.setState('user', {
      name: 'Test Taxpayer',
      role: 'taxpayer',
      token: 'taxpayer',
      userId: 'taxpayer',
    });
  });

  it('Taxpayer creates a new case', async () => {
    await test.runSequence('gotoFilePetitionSequence');
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });
    await test.runSequence('updatePetitionValueSequence', {
      key: 'requestForPlaceOfTrial',
      value: fakeFile,
    });
    await test.runSequence('updatePetitionValueSequence', {
      key: 'statementOfTaxpayerIdentificationNumber',
      value: fakeFile,
    });
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your files were uploaded successfully.',
      message: 'Your case has now been created.',
    });
  });

  it('Taxpayer views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(test.getState('cases').length).toBeGreaterThan(0);
    docketNumber = test.getState('cases.0.docketNumber');
  });

  it('Taxpayer views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', { docketNumber });
    expect(test.getState('currentPage')).toEqual('CaseDetailPetitioner');
    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
    expect(test.getState('caseDetail.documents').length).toEqual(3);
    await test.runSequence('viewDocumentSequence', {
      documentId: test.getState('caseDetail.documents.0.documentId'),
      callback: documentBlob => {
        expect(documentBlob).toBeTruthy();
      },
    });
  });

  it('Petitions clerk logs in', async () => {
    test.setState('user', {
      name: 'Petitions Clerk',
      role: 'petitionsclerk',
      token: 'petitionsclerk',
      userId: 'petitionsclerk',
    });
  });

  it('Petitions clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('cases').length).toBeGreaterThan(0);
  });

  it('Petitions clerk searches for case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: docketNumber,
    });
    await test.runSequence('submitSearchSequence');
    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
  });

  it('Petitions clerk views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', { docketNumber });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
    expect(test.getState('caseDetail.status')).toEqual('new');
    expect(test.getState('caseDetail.documents').length).toEqual(3);
  });

  it('Petitions clerk records pay.gov ID', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'payGovId',
      value: '123',
    });
    await test.runSequence('submitUpdateCaseSequence');
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', { docketNumber });
    expect(test.getState('caseDetail.payGovId')).toEqual('123');
  });

  it('Petitions clerk submits case to IRS', async () => {
    await test.runSequence('submitToIrsSequence');
    expect(test.getState('caseDetail.status')).toEqual('general');
    expect(test.getState('alertSuccess.title')).toEqual(
      'Successfully served to IRS',
    );
  });

  it('Respondent logs in', async () => {
    test.setState('user', {
      name: 'IRS Attorney',
      role: 'respondent',
      token: 'respondent',
      userId: 'respondent',
    });
  });

  it('Respondent views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardRespondent');
    expect(test.getState('cases').length).toBeGreaterThan(0);
  });

  it('Respondent views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', { docketNumber });
    expect(test.getState('currentPage')).toEqual('CaseDetailRespondent');
    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
    expect(test.getState('caseDetail.status')).toEqual('general');
    expect(test.getState('caseDetail.documents').length).toEqual(3);
  });

  it('Respondent adds answer', async () => {
    await test.runSequence('updateDocumentValueSequence', {
      key: 'documentType',
      value: Case.documentTypes.answer,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'file',
      value: fakeFile,
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('caseDetail.documents').length).toEqual(4);
  });

  it('Respondent adds a stipulated decision', async () => {
    await test.runSequence('updateDocumentValueSequence', {
      key: 'documentType',
      value: Case.documentTypes.stipulatedDecision,
    });
    await test.runSequence('updateDocumentValueSequence', {
      key: 'file',
      value: fakeFile,
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('caseDetail.documents').length).toEqual(5);
  });
});
