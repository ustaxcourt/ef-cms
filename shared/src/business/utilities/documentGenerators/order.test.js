const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { order } = require('./order');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const pdfPath = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(pdfPath, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      fs.mkdirSync(testOutputPath, { recursive: true }, err => {
        if (err) throw err;
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('notice', () => {
    it('generates a Notice document', async () => {
      const pdf = await order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent: `<p>This is some sample notice text.</p>

          <p>NOTICE that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

          <p>NOTICE that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>`,
          orderTitle: 'NOTICE',
          signatureText: 'Test Signature',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('order', () => {
    it('generates an Order document', async () => {
      const pdf = await order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent: `<p>Upon due consideration ofthe parties' joint motion to remand, filed December 30, 2019, and the parties' joint motion for continuance, filed December 30, 2019, it is</p>

          <p>ORDERED that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

          <p>ORDERED that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>`,
          orderTitle: 'ORDER',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Order', pdf);
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
