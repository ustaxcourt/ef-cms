import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';

presenter.providers.applicationContext = applicationContext;

presenter.providers.applicationContext.getFileReader = () =>
  function() {
    this.onload = null;
    this.onerror = null;
    this.readAsDataURL = function() {
      this.result = 'abc';
      this.onload();
    };
  };

presenter.providers.applicationContext.getPdfJs = async () => ({
  getDocument: () => {
    return {
      promise: Promise.resolve({
        getPage: () => {
          return {
            cleanup: () => null,
            getViewport: () => ({
              height: 100,
              width: 100,
            }),
            render: () => null,
          };
        },
        numPages: 5,
      }),
    };
  },
});

let test;
test = CerebralTest(presenter);

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

describe('setPageSequence', () => {
  beforeEach(async () => {
    test.setState('pdfPreviewModal', {});
    await test.runSequence('loadPdfSequence', {
      ctx: 'abc',
      file: fakeFile,
    });
  });

  it('should not allow the desired page to go above the totalPages', async () => {
    await test.runSequence('setPageSequence', {
      currentPage: 100,
    });
    expect(test.getState('pdfPreviewModal')).toMatchObject({
      currentPage: 5,
    });
  });

  it('should not allow the desired page to go below 1', async () => {
    await test.runSequence('setPageSequence', {
      currentPage: -200,
    });
    expect(test.getState('pdfPreviewModal')).toMatchObject({
      currentPage: 1,
    });
  });

  it('should set the desired page if inside the range', async () => {
    await test.runSequence('setPageSequence', {
      currentPage: 3,
    });
    expect(test.getState('pdfPreviewModal')).toMatchObject({
      currentPage: 3,
    });
  });
});
