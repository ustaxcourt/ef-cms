import { BigHeader } from '../BigHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

const RenderHealthStatus = ({ id, item, requiresMargin = false }) => {
  return (
    <div
      className={classNames('grid-col-3', requiresMargin && 'margin-top-05')}
      id={id}
    >
      <h4 className="text-light font-sans-pro">
        {item ? 'Pass' : 'Fail'}{' '}
        <FontAwesomeIcon
          className={item ? 'margin-left-2px' : 'margin-left-1'}
          color={item ? 'green' : 'red'}
          icon={item ? 'check-circle' : 'times-circle'}
          size="lg"
        />
      </h4>
    </div>
  );
};

export const HealthCheck = connect(
  {
    health: state.health,
  },
  function HealthCheck({ health }) {
    const components = {
      cognito: (
        <RenderHealthStatus
          id="cognito"
          item={health.cognito}
          requiresMargin={true}
        />
      ),
      dynamoEfcms: (
        <RenderHealthStatus id="dynamoEfcms" item={health.dynamo.efcms} />
      ),
      dynamoEfcmsDeploy: (
        <RenderHealthStatus
          id="dynamo-deploy-table"
          item={health.dynamo.efcmsDeploy}
        />
      ),
      dynamsoft: (
        <RenderHealthStatus
          id="dynamsoft"
          item={health.dynamsoft}
          requiresMargin={true}
        />
      ),
      elasticsearch: (
        <RenderHealthStatus
          id="elasticsearch"
          item={health.elasticsearch}
          requiresMargin={true}
        />
      ),
      emailService: (
        <RenderHealthStatus
          id="emailService"
          item={health.emailService}
          requiresMargin={true}
        />
      ),
      s3App: <RenderHealthStatus id="s3-app" item={health.s3.app} />,
      s3AppFailover: (
        <RenderHealthStatus id="s3-app-failover" item={health.s3.appFailover} />
      ),
      s3EastDocuments: (
        <RenderHealthStatus
          id="s3-east-documents"
          item={health.s3.eastDocuments}
        />
      ),
      s3EastTempDocuments: (
        <RenderHealthStatus
          id="s3-east-temp-documents"
          item={health.s3.eastTempDocuments}
        />
      ),
      s3Public: <RenderHealthStatus id="s3-public" item={health.s3.public} />,
      s3PublicFailover: (
        <RenderHealthStatus id="s3-failover" item={health.s3.publicFailover} />
      ),
      s3WestDocuments: (
        <RenderHealthStatus
          id="s3-west-documents"
          item={health.s3.westDocuments}
        />
      ),
      s3WestTempDocuments: (
        <RenderHealthStatus
          id="s3-west-temp-documents"
          item={health.s3.westTempDocuments}
        />
      ),
    };

    return (
      <>
        <BigHeader text="Health Check" />
        <section className="usa-section grid-container">
          <NonMobile>
            <div className="grid-row grid-gap">
              <div className="grid-col-4">
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-205 grid-row">
                    <div className="grid-col-9">Cognito</div>
                    {components.cognito}
                  </h2>
                </div>
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-205 grid-row">
                    <div className="grid-col-9"> Dynamsoft</div>
                    {components.dynamsoft}
                  </h2>
                </div>
                <div className="card">
                  <h2 className="margin-top-2 margin-left-205">DynamoDB</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">efcms</div>
                    {components.dynamoEfcms}
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      efcmsDeploy
                    </div>
                    {components.dynamoEfcmsDeploy}
                  </div>
                </div>
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-2 grid-row">
                    <div className="grid-col-9">Email Service</div>
                    {components.emailService}
                  </h2>
                </div>
              </div>
              <div className="grid-col-4">
                <div className="card">
                  <h2 className="margin-top-2 margin-left-205">s3 Public</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">client</div>
                    {components.s3Public}
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      clientFailover
                    </div>
                    {components.s3PublicFailover}
                  </div>
                </div>
                <div className="card">
                  <h2 className="margin-top-2 margin-left-205">s3 App</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">client</div>
                    {components.s3App}
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      clientFailover
                    </div>
                    {components.s3AppFailover}
                  </div>
                </div>
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-2 grid-row">
                    <div className="grid-col-9">ElasticSearch</div>
                    {components.elasticsearch}
                  </h2>
                </div>
              </div>
              <div className="grid-col-4">
                <div className="card">
                  <h2 className="margin-top-2 margin-left-205">s3 East</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text  grid-col-9">
                      documents
                    </div>
                    {components.s3EastDocuments}
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text  grid-col-9">
                      tempDocuments
                    </div>
                    {components.s3EastTempDocuments}
                  </div>
                </div>
                <div className="card">
                  <h2 className="margin-top-2 margin-left-205">s3 West</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">
                      documents
                    </div>
                    {components.s3WestDocuments}
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      tempDocuments
                    </div>
                    {components.s3WestTempDocuments}
                  </div>
                </div>
              </div>
            </div>
          </NonMobile>
          <Mobile>
            <div className="grid-row">
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-205 grid-row">
                  <div className="grid-col-9"> Cognito</div>
                  {components.cognito}
                </h2>
              </div>
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-205 grid-row">
                  <div className="grid-col-9"> Dynamsoft</div>
                  {components.dynamsoft}
                </h2>
              </div>
            </div>
            <div className="grid-row">
              <div className="card width-full">
                <h2 className="margin-top-2 margin-left-205">DynamoDB</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">efcms</div>
                  {components.dynamoEfcms}
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    efcmsDeploy
                  </div>
                  {components.dynamoEfcmsDeploy}
                </div>
              </div>

              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-2 grid-row">
                  <div className="grid-col-9"> ElasticSearch</div>
                  {components.elasticsearch}
                </h2>
              </div>
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-2 grid-row">
                  <div className="grid-col-9"> Email Service</div>
                  {components.emailService}
                </h2>
              </div>
            </div>
            <div className="grid-row">
              <div className="card width-full">
                <h2 className="margin-top-2 margin-left-205">s3 Public</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">client</div>
                  {components.s3Public}
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    clientFailover
                  </div>
                  {components.s3PublicFailover}
                </div>
              </div>
              <div className="card width-full">
                <h2 className="margin-top-2 margin-left-205">s3 East</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">documents</div>
                  {components.s3EastDocuments}
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    tempDocuments
                  </div>
                  {components.s3EastTempDocuments}
                </div>
              </div>
            </div>
            <div className="grid-row">
              <div className="card  width-full">
                <h2 className="margin-top-2 margin-left-205">s3 App</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">client</div>
                  {components.s3App}
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    clientFailover
                  </div>
                  {components.s3AppFailover}
                </div>
              </div>
              <div className="card width-full">
                <h2 className="margin-top-2 margin-left-205">s3 West</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">documents</div>
                  {components.s3WestDocuments}
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    tempDocuments
                  </div>
                  {components.s3WestTempDocuments}
                </div>
              </div>
            </div>
          </Mobile>
        </section>
      </>
    );
  },
);

HealthCheck.displayName = 'HealthCheck';
