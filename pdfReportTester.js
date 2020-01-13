const fs = require('fs');
const pug = require('pug');
const sass = require('node-sass');
const {
  generateNoticeOfTrialIssuedTemplate,
} = require('./shared/src/business/utilities/generateHTMLTemplateForPDF/generateNoticeOfTrialIssuedTemplate');

(async () => {
  const noticeOfTrialIssuedHtml = await generateNoticeOfTrialIssuedTemplate({
    applicationContext: {
      getNodeSass: () => sass,
      getPug: () => pug,
    },
    content: {
      caption: 'Jenny Craig',
      docketNumberWithSuffix: '101-20S',
      trialInfo: {
        address1: '123 Testing St',
        address2: 'Ste 123',
        city: 'Chicago',
        courthouseName: 'Courthouse 123',
        judge: { name: 'Judge Happy' },
        startDate: '2025-12-12T05:00:00.000Z',
        startTime: '10:00',
        state: 'IL',
        zip: '55555',
      },
    },
  });

  fs.writeFileSync('./noticeOfTrialIssued.html', noticeOfTrialIssuedHtml);
})();
