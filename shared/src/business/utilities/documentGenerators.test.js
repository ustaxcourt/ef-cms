const { applicationContext } = require('../test/createTestApplicationContext');

const fs = require('fs');
const path = require('path');
const {
  generatePdfFromHtmlInteractor,
} = require('../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('./getChromiumBrowser');

const { changeOfAddress } = require('./documentGenerators');

describe('documentGenerators', () => {
  const testOutputPath = path.join(
    __dirname,
    '../../../test-output/document-generation/',
  );

  const writePdfFile = (name, data) => {
    const path = `${testOutputPath}${name}.pdf`;
    fs.writeFileSync(path, data);
  };

  beforeAll(() => {
    if (!process.env.CIRCLE_SHA1) {
      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext.getNodeSass.mockImplementation(() => {
        // eslint-disable-next-line security/detect-non-literal-require
        return require('node-' + 'sass');
      });

      applicationContext.getPug.mockImplementation(() => {
        // eslint-disable-next-line security/detect-non-literal-require
        return require('p' + 'ug');
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('changeOfAddress', () => {
    it('Generates a Change of Address document', async () => {
      const contactInfo = {
        address1: 'Address 1',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'City',
        country: 'USA',
        inCareOf: 'Test Care Of',
        phone: '123-124-1234',
        postalCode: '12345',
        state: 'ST',
      };
      const pdf = await changeOfAddress({
        applicationContext,
        content: {
          caseCaptionExtension: 'Practitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Notice of Change of Address',
          name: 'Test Person',
          newData: {
            ...contactInfo,
            address1: 'Address One',
          },
          oldData: contactInfo,
        },
      });

      // Do not write PDF when running on CircleCI
      if (!process.env.CIRCLE_SHA1) {
        writePdfFile('Change_Of_Address', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
