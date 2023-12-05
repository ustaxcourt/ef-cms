import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';
import howToUseSearch from '../../../pdfs/how-to-use-search.pdf';

export const HowToSearch = connect({}, function HowToSearch() {
  return (
    <>
      <div className="card gray">
        <div className="content-wrapper how-to-search">
          <h3>How to Use Search</h3>
          <hr />
          <table className="margin-bottom-0 search-info">
            <tbody>
              <tr>
                <td>&quot;&quot;</td>
                <td>
                  Include only <b>exact matches</b> <br />
                </td>
              </tr>
              <tr>
                <td>+</td>
                <td>
                  AND (includes <b>all</b> words/phrases)
                </td>
              </tr>
              <tr>
                <td>|</td>
                <td>
                  OR (includes <b>one or more</b> words/phrases)
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <i>No other commands are supported at this time</i>
          </p>
          <p>
            <FontAwesomeIcon
              className="fa-icon-blue"
              icon="file-pdf"
              size="1x"
            />
            <a
              className="usa-link--external"
              href={howToUseSearch}
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more about searching in DAWSON
            </a>
          </p>
        </div>
      </div>
    </>
  );
});

HowToSearch.displayName = 'HowToSearch';
