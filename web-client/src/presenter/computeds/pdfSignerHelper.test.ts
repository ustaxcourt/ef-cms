import { applicationContext } from '../../applicationContext';
import { pdfSignerHelper as pdfSignerHelperComputed } from './pdfSignerHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

const pdfSignerHelper = withAppContextDecorator(
  pdfSignerHelperComputed,
  applicationContext,
);
let mockState;

beforeAll(() => {
  mockState = {
    caseDetail: {
      docketEntries: [
        {
          docketEntryId: '123',
          eventCode: 'PSDE',
        },
      ],
    },
    docketEntryId: '123',
    form: {},
    pdfForSigning: {
      signatureData: true,
    },
  };
});

describe('pdfSignerHelper', () => {
  it('should set disableSaveAndSendButton to true when the message inputs are not defined and pdf data is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: mockState,
    });
    expect(disableSaveAndSendButton).toBeTruthy();
  });

  it('should set disableSaveAndSendButton to true when the pdf data is not defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        pdfForSigning: {
          signatureData: null,
        },
      },
    });
    expect(disableSaveAndSendButton).toBeTruthy();
  });

  it('should set disableSaveAndSendButton to false when section is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        form: {
          section: 'a',
        },
        pdfForSigning: {
          signatureData: 'a',
        },
      },
    });
    expect(disableSaveAndSendButton).toBeFalsy();
  });

  it('should set disableSaveAndSendButton to false when message is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        form: {
          message: 'a',
        },
        pdfForSigning: {
          signatureData: 'a',
        },
      },
    });
    expect(disableSaveAndSendButton).toBeFalsy();
  });

  it('should set disableSaveAndSendButton to false when assigneeId is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        form: {
          assigneeId: 'a',
        },
        pdfForSigning: {
          signatureData: 'a',
        },
      },
    });
    expect(disableSaveAndSendButton).toBeFalsy();
  });

  it('should set disableSaveButton to true when the pdf data is not defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        pdfForSigning: {
          signatureData: null,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  it('should set disableSaveButton to true when the pdf data is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeFalsy();
  });

  it('should set disableSaveButton to true when section is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        form: {
          section: true,
        },
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  it('should set disableSaveButton to true when assigneeId is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        form: {
          assigneeId: 'a',
        },
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  it('should set disableSaveButton to true when message is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        ...mockState,
        form: {
          message: 'a',
        },
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  describe('showSkipSignatureButton', () => {
    it('should be false when the document eventCode is PSDE and there is no signature data and the PDF is not already signed', () => {
      const { showSkipSignatureButton } = runCompute(pdfSignerHelper, {
        state: {
          ...mockState,
          form: {
            message: 'a',
          },
          pdfForSigning: {
            eventCode: 'PSDE',
            isPdfAlreadySigned: false,
            signatureData: false,
          },
        },
      });

      expect(showSkipSignatureButton).toBeFalsy();
    });

    it('should be true when the document eventCode is not PSDE and there is no signature data and the PDF is already signed', () => {
      const { showSkipSignatureButton } = runCompute(pdfSignerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                eventCode: 'O',
              },
            ],
          },
          docketEntryId: '123',
          form: {
            message: 'a',
          },
          pdfForSigning: {
            eventCode: 'O',
            isPdfAlreadySigned: false,
            signatureData: false,
          },
        },
      });

      expect(showSkipSignatureButton).toBeTruthy();
    });

    it('should be true when the document eventCode is not PSDE and a signature has not been previously placed on the document', () => {
      const { showSkipSignatureButton } = runCompute(pdfSignerHelper, {
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                eventCode: 'O',
              },
            ],
          },
          docketEntryId: '123',
          form: {
            message: 'a',
          },
          pdfForSigning: {
            eventCode: 'O',
            signatureData: false,
          },
        },
      });

      expect(showSkipSignatureButton).toBeTruthy();
    });

    it('should be false when the document eventCode is PSDE', () => {
      const { showSkipSignatureButton } = runCompute(pdfSignerHelper, {
        state: {
          ...mockState,
          form: {
            message: 'a',
          },
          pdfForSigning: {
            eventCode: 'PSDE',
            signatureData: false,
          },
        },
      });

      expect(showSkipSignatureButton).toBeFalsy();
    });
  });
});
