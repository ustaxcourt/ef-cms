const ustcLogoBufferBase64 = require('../../../../static/images/ustc_seal.png_');

/**
 * generateCoverPagePdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.content the html content for the cover sheet
 * @returns {Buffer} the pdf as a binary buffer
 */
exports.generateCoverPagePdf = async ({ applicationContext, content }) => {
  let browser = null;
  let result = null;
  const horizontalMargin = 40;

  try {
    browser = await applicationContext.getChromiumBrowser();
    let page = await browser.newPage();

    const headerTemplate = '';
    const fontSizeDefault = 15;
    const fontSizeCaption = 15;
    const fontSizeTitle = 18;

    const mainContent = `
    <div class="container" style="padding: 20px ${horizontalMargin}px; font-size: ${fontSizeDefault}px; font-family: sans-serif;">
      <style type="text/css">
        .width-half {
          width: 50%;
        }

        .width-60 {
          width: 40%;
        }

        .width-40 {
          width: 40%;
        }

        .float-left {
          float: left;
        }

        .float-right {
          float: right;
        }
        .clear {
          clear: both;
        }
        .text-center {
          text-align: center;
        }
        .text-indent {
          padding-left:25%;
        }
      </style>
      <div>
        <div class="width-half float-left">
          <div class="width-half float-left"><img src="${ustcLogoBufferBase64}" width="80" height="80"/></div>
          <div class="width-half float-right text-center">
            <b>Received</b>
            <br />
            ${content.dateReceived}
          </div>
          <div class="clear"></div>
        </div>
        <div class="width-half float-right text-center">
          <b>${content.dateFiledLodgedLabel}</b>
          <br />
          ${content.dateFiledLodged}
        </div>
        <div class="clear"></div>
      </div>

      <div style="margin-top: 40px; font-size:${fontSizeCaption}px;">
        <div class="width-60 float-left">
          ${content.caseTitle}
          <br /><br />
          <div class="text-indent">
            ${content.caseCaptionExtension}
            <br /><br />
            v.
          </div>
          <br />
          Commissioner of Internal Revenue,
          <br /><br />
          <div class="text-indent">
            Respondent
          </div>
        </div>
        <div class="width-40 float-right" style="padding-top:40px;">
          <div style="padding-left: 10px;">
            ${content.electronicallyFiled ? 'Electronically Filed<br />' : ''}
            ${content.mailingDate ? content.mailingDate + '<br />' : ''}
            <br />
            ${content.docketNumber}
          </div>
        </div>
        <div class="clear"></div>
      </div>

      <div class="text-center" style="font-size:${fontSizeTitle}px; margin-top:200px;">
        ${content.documentTitle}
      </div>
    </div>`;

    const footerTemplate = `
      <!doctype html>
      <html>
        <head>
        </head>
        <body>
          <div style="font-size: ${fontSizeDefault}px !important; font-family: Arial, sans-serif !important; width: 100%; margin-top: 25px; padding: 0px ${horizontalMargin}px;">
          ${content.certificateOfService}

            <div style="text-align: center; font-weight: bold; width: 100%;  margin-top: 25px;">
              ${content.dateServed}
            </div>
          </div>
          <br /><br />

        </body>
      </html>`;

    await page.setContent(mainContent);

    result = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate,
      format: 'Letter',
      headerTemplate,
      margin: {
        bottom: '200px',
        top: '0px',
      },
      printBackground: true,
    });
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  return result;
};
