import { generateHTMLTemplateForPDF } from './index';

/**
 * HTML template generator for a Notice of Trial Issued
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateNoticeOfTrialIssuedTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    trialInfo,
  } = content;

  const main = `
    <div class="trial-at">
      <table>
        <thead>
          <tr>
            <th>Trial At:</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <p>${trialInfo.address2}</p>
              <p>${trialInfo.courthouseName}</p>
              <p>${trialInfo.address1}</p>
              <p>
                ${trialInfo.city}, ${trialInfo.state} ${trialInfo.postalCode}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <br /><br />
    </div>

    <div class="judge">
      <table>
        <thead>
          <tr>
            <th>Judge:</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${trialInfo.judge}
            </td>
          </tr>
        </tbody>
      </table>
      <br /><br />
    </div>

    <h2>NOTICE SETTING CASE FOR TRIAL</h2>
    <p>This case is set for trial at the Trial Session beginning at ${trialInfo.startTime} on ${trialInfo.startDate}. The calendar for that Session will be called at that date and time, and the parties are expected to be present and to be prepared to try the case.  Your failure to appear may result in dismissal of the case and entry of decision against you.</p>
    <p>The Court will set the time for each trial at the end of the calendar call.  In setting trial times the Court attempts to accommodate the parties, but the final determination of trial times rests in the Court’s discretion. </p>
    <p>Information about presenting a case in the Tax Court can be found at <a target="_blank" href="www.ustaxcourt.gov">www.ustaxcourt.gov</a>.</p>
    <p>The parties should contact each other promptly and cooperate fully so that the necessary steps can be taken to comply with these requirements.  Your failure to cooperate may also result in dismissal of the case and entry of decision against you.</p>

    <div class="signature">
      <p>Stephanie A. Servoss<p>
      <p>Clerk of the Court</p>
    </div>
  `;

  const styles = `
    .trial-at {
      width: 60%;
      float: left;
    }

    .judge {
      width: 35%;
      float: right;
    }

    .signature {
      margin-top:40px;
      text-align: right;
    }

    th, td {
      font-size: 10px;
    }
    th {
      font-weight: 600;
    }
  `;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    styles,
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = {
  generateNoticeOfTrialIssuedTemplate,
};
