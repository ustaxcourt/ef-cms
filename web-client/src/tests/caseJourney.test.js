import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';

import presenter from '../presenter';
import applicationContext from '../applicationContexts/dev';

let test;
let docketNumber;
global.FormData = FormData;
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
  describe('Tax payer creates a new case', async () => {
    describe('Initiate case', () => {
      console.log('FIRST PEITIONER TEST');
      test.setState('user', {
        firstName: 'Test',
        lastName: 'Taxpayer',
        role: 'taxpayer',
        token: 'taxpayer',
        userId: 'taxpayer',
      });
      it('Submits successfully', async () => {
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
    });

    describe('View petitioner dashboard', () => {
      it('Displays cases', async () => {
        await test.runSequence('gotoDashboardSequence');
        expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
        expect(test.getState('cases').length).toBeGreaterThan(0);
        docketNumber = test.getState('cases.0.docketNumber');
      });
    });

    describe('View petitioner case detail', () => {
      it('Displays case', async () => {
        console.log('LAST PEITIONER TEST');
        await test.runSequence('gotoCaseDetailSequence', { docketNumber });
        expect(test.getState('currentPage')).toEqual('CaseDetailPetitioner');
        expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
        expect(test.getState('caseDetail.documents').length).toEqual(3);
      });
    });
  });

  describe('Petitions clerk sends case to IRS', () => {
    describe('View petitions clerk dashboard', () => {
      console.log('FIRST CLERK TEST');
      test.setState('user', {
        firstName: 'Petitions',
        lastName: 'Clerk',
        role: 'petitionsclerk',
        token: 'petitionsclerk',
        userId: 'petitionsclerk',
      });
      it('Displays cases', async () => {
        await test.runSequence('gotoDashboardSequence');
        expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
        expect(test.getState('cases').length).toBeGreaterThan(0);
      });
    });

    describe('View case detail', () => {
      console.log('LAST CLERK TEST');
      it('Displays case', async () => {
        test.setState('caseDetail', {});
        await test.runSequence('gotoCaseDetailSequence', { docketNumber });
        expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
        expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
      });
      it('Submits to IRS', async () => {
        await test.runSequence('submitToIrsSequence');
      });
    });

    // describe('Search box', async () => {
    //   it('takes us to case details', async done => {
    //     test.setState('user', {
    //       firstName: 'Petitions',
    //       lastName: 'Clerk',
    //       role: 'petitionsclerk',
    //       token: 'petitionsclerk',
    //       userId: 'petitionsclerk',
    //     });
    //     test.setState('caseDetail', {});
    //     await test.runSequence('updateSearchTermSequence', {
    //       searchTerm: docketNumber,
    //     });
    //     await test.runSequence('submitSearchSequence');
    //     expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
    //     done();
    //   });
    // });
  });
});
