const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');

const saveDocumentStub = jest.fn();

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

const contactInfo = {
  address1: '234 Main St',
  address2: 'Apartment 4',
  address3: 'Under the stairs',
  city: 'Chicago',
  country: 'Brazil',
  countryType: 'international',
  phone: '+1 (555) 555-5555',
  postalCode: '61234',
  state: 'IL',
};

describe('updateUserContactInformationInteractor', () => {
  it('updates the user and respondents in the case', async () => {
    const updateCaseSpy = jest.fn();
    const updateUserSpy = jest.fn();
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([
              {
                ...MOCK_CASE,
                respondents: [
                  {
                    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
                  },
                ],
              },
            ]),
          getUserById: () =>
            Promise.resolve(MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f']),
          saveDocument: saveDocumentStub,
          saveWorkItemForNonPaper: () => null,
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
      getTemplateGenerators: () => {
        return {
          generateChangeOfAddressTemplate: () => '<div></div>',
          generateHTMLTemplateForPDF: () => '<div></div>',
          generatePrintableDocketRecordTemplate: () => '<div></div>',
        };
      },
      getUniqueId: () => 'a7d90c05-f6cd-442c-a168-202db587f16f',
      getUseCases: () => ({
        generatePdfFromHtmlInteractor: () => fakeFile,
      }),
      getUtilities: () => ({
        formatDateString: () => '11/11/2011',
        getDocumentTypeForAddressChange: () => ({
          eventCode: 'NCA',
          title: 'Notice of Change of Address',
        }),
      }),
      logger: {
        time: () => null,
        timeEnd: () => null,
      },
    };
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      contact: contactInfo,
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      respondents: [
        {
          ...contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('updates the user and practitioners in the case', async () => {
    const updateCaseSpy = jest.fn();
    const updateUserSpy = jest.fn();
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([
              {
                ...MOCK_CASE,
                practitioners: [
                  {
                    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
                  },
                ],
              },
            ]),
          getUserById: () =>
            Promise.resolve(MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f']),
          saveDocument: saveDocumentStub,
          saveWorkItemForNonPaper: () => null,
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
      getTemplateGenerators: () => {
        return {
          generateChangeOfAddressTemplate: () => '<div></div>',
          generateHTMLTemplateForPDF: () => '<div></div>',
          generatePrintableDocketRecordTemplate: () => '<div></div>',
        };
      },
      getUniqueId: () => 'a7d90c05-f6cd-442c-a168-202db587f16f',
      getUseCases: () => ({
        generatePdfFromHtmlInteractor: () => fakeFile,
      }),
      getUtilities: () => ({
        formatDateString: () => '11/11/2011',
        getDocumentTypeForAddressChange: () => ({
          eventCode: 'NCA',
          title: 'Notice of Change of Address',
        }),
      }),
      logger: {
        time: () => null,
        timeEnd: () => null,
      },
    };
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      contact: contactInfo,
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      practitioners: [
        {
          ...contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('returns unauthorized error when user not authorized', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {};
      },
    };
    let result = null;
    try {
      await updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorized error when the user attempts to update a different user not owned by themself', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {};
      },
    };
    let result = null;
    try {
      await updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });
});
