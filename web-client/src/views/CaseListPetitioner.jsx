import { Button } from '../ustc-ui/Button/Button';
import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListPetitioner = connect(
  {
    formattedCases: state.formattedCases,
  },
  ({ formattedCases }) => {
    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="tablet:grid-col-6 hide-on-mobile">
              <h2 className="margin-0">My Cases</h2>
            </div>
            <div className="tablet:grid-col-6 mobile:grid-col-12 text-right">
              <Button
                className="new-case tablet-full-width margin-right-0"
                href="/before-filing-a-petition"
                icon="file"
                id="file-a-petition"
              >
                File a Petition
              </Button>
            </div>
          </div>
        </div>
        <div className="padding-top-205 show-on-mobile">
          <h2>My Cases</h2>
        </div>
        <div className="margin-top-2">
          <table
            className="usa-table responsive-table dashboard"
            id="case-list"
          >
            <thead>
              <tr>
                <th>Docket number</th>
                <th>Case name</th>
                <th>Date filed</th>
              </tr>
            </thead>
            <tbody>
              {formattedCases.map(item => (
                <tr key={item.docketNumber}>
                  <td className="hide-on-mobile">
                    <CaseLink formattedCase={item} />
                  </td>
                  <td className="hide-on-mobile">{item.caseName}</td>
                  <td>{item.createdAtFormatted}</td>
                  <td className="show-on-mobile">
                    <div>
                      <CaseLink formattedCase={item} />
                    </div>
                    {item.caseName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  },
);
