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
      caption: 'Jenny Craig, Petitioner',
      captionPostfix: 'v. Commissioner of Internal Revenue, Respondent',
      docketNumberWithSuffix: '101-20S',
      trialInfo: {
        address1: '123 Testing St',
        address2: 'Ste 123',
        city: 'Chicago',
        courthouseName: 'Courthouse 123',
        judge: { name: 'Judge Happy' },
        startDate: '12/12/2021',
        startTime: '10:00',
        state: 'IL',
        zip: '55555',
      },
    },
  });

  fs.writeFileSync('./noticeOfTrialIssued.html', noticeOfTrialIssuedHtml);
})();
