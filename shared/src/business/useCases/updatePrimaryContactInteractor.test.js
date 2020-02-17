const {
  createISODateString,
  formatDateString,
} = require('../../../../shared/src/business/utilities/DateHandler');
const {
  updatePrimaryContactInteractor,
} = require('./updatePrimaryContactInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

let updateCaseStub;
let generateChangeOfAddressTemplateStub;
let generatePdfFromHtmlInteractorStub;
let getAddressPhoneDiffStub;
let getDocumentTypeForAddressChangeStub;
let saveDocumentFromLambdaStub;
let sendServedPartiesEmailsStub;

let persistenceGateway;
let useCases;
let applicationContext;

describe('update primary contact on a case', () => {
  beforeEach(() => {
    updateCaseStub = jest.fn();
    generateChangeOfAddressTemplateStub = jest.fn();
    generatePdfFromHtmlInteractorStub = jest.fn();
    getAddressPhoneDiffStub = jest.fn();
    getDocumentTypeForAddressChangeStub = jest.fn();
    saveDocumentFromLambdaStub = jest.fn();
    sendServedPartiesEmailsStub = jest.fn();

    persistenceGateway = {
      getCaseByCaseId: () => MOCK_CASE,
      saveDocumentFromLambda: saveDocumentFromLambdaStub,
      saveWorkItemForNonPaper: () => null,
      updateCase: updateCaseStub,
    };

    useCases = {
      generatePdfFromHtmlInteractor: () => {
        generatePdfFromHtmlInteractorStub();
        return fakeFile;
      },
      userIsAssociated: () => true,
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCaseCaptionNames: Case.getCaseCaptionNames,
      getCurrentUser: () => {
        return new User({
          name: 'bob',
          role: User.ROLES.petitioner,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getDispatchers: () => ({
        sendBulkTemplatedEmail: () => null,
      }),
      getPersistenceGateway: () => {
        return persistenceGateway;
      },
      getTemplateGenerators: () => {
        return {
          generateChangeOfAddressTemplate: async () => {
            generateChangeOfAddressTemplateStub();
            return '<html></html>';
          },
        };
      },
      getUniqueId: () => 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      getUseCaseHelpers: () => ({
        sendServedPartiesEmails: sendServedPartiesEmailsStub,
      }),
      getUseCases: () => useCases,
      getUtilities: () => {
        return {
          createISODateString,
          formatDateString,
          getAddressPhoneDiff: () => {
            getAddressPhoneDiffStub();
            return {
              address1: {
                newData: 'new test',
                oldData: 'test',
              },
            };
          },
          getDocumentTypeForAddressChange: () => {
            getDocumentTypeForAddressChangeStub();
            return {
              eventCode: 'NCA',
              title: 'Notice of Change of Address',
            };
          },
        };
      },
      logger: {
        time: () => null,
        timeEnd: () => null,
      },
    };
  });

  it('updates contactPrimary', async () => {
    const caseDetail = await updatePrimaryContactInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactInfo: {
        address1: '453 Electric Ave',
        city: 'Philadelphia',
        countryType: 'domestic',
        email: 'petitioner',
        name: 'Bill Burr',
        phone: '1234567890',
        postalCode: '99999',
        serviceIndicator: 'Electronic',
        state: 'PA',
      },
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).toHaveBeenCalled();
    expect(sendServedPartiesEmailsStub).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).toHaveBeenCalled();
    expect(caseDetail.documents[4].servedAt).toBeDefined();
    expect(caseDetail.documents[4].servedParties).toEqual([
      { email: 'petitioner', name: 'Bill Burr' },
    ]);
  });

  it('throws an error if the case was not found', async () => {
    persistenceGateway.getCaseByCaseId = async () => null;
    let error = null;
    try {
      await updatePrimaryContactInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactInfo: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual(
      'Case a805d1ab-18d0-43ec-bafb-654e83405416 was not found.',
    );
  });

  it('throws an error if the user making the request is not associated with the case', async () => {
    persistenceGateway.getCaseByCaseId = async () => ({
      ...MOCK_CASE,
      userId: '123',
    });
    useCases.userIsAssociated = () => false;
    let error = null;
    try {
      await updatePrimaryContactInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactInfo: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Unauthorized for update case contact');
  });

  it('does not update the case if the contact information does not change', async () => {
    const getUtilities = applicationContext.getUtilities();
    applicationContext.getUtilities = () => ({
      ...getUtilities,
      getDocumentTypeForAddressChange: () => undefined, // returns undefined when there is no diff
    });
    await updatePrimaryContactInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactInfo: {
        // Matches current contact info
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
    });

    expect(updateCaseStub).not.toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).not.toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).not.toHaveBeenCalled();
  });
});
