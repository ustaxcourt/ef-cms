import { BigHeader } from '../BigHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const RenderHealthStatus = ({ item, requiresMargin = false }) => {
  return (
    <div
      className={classNames('grid-col-3', requiresMargin && 'margin-top-05')}
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
    return (
      <>
        <BigHeader text="Health Check" />
        <section className="usa-section grid-container ">
          <NonMobile>
            <div className="grid-row grid-gap">
              <div className="grid-col-3">
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-205 grid-row">
                    <div className="grid-col-9"> ClamAV</div>
                    <RenderHealthStatus
                      item={health.clamAV}
                      requiresMargin={true}
                    />
                  </h2>
                </div>
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-205 grid-row">
                    <div className="grid-col-9">Cognito</div>
                    <RenderHealthStatus
                      item={health.cognito}
                      requiresMargin={true}
                    />
                  </h2>
                </div>
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-205 grid-row">
                    <div className="grid-col-9"> Dynamsoft</div>
                    <RenderHealthStatus
                      item={health.dynamsoft}
                      requiresMargin={true}
                    />
                  </h2>
                </div>
              </div>
              <div className="grid-col-3">
                <div className="card height-card">
                  <h2 className="margin-top-2 margin-left-205">DynamoDB</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">efcms</div>
                    <RenderHealthStatus item={health.dynamo.efcms} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      efcmsDeploy
                    </div>
                    <RenderHealthStatus item={health.dynamo.efcmsDeploy} />
                  </div>
                </div>

                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-2 grid-row">
                    <div className="grid-col-9">ElasticSearch</div>
                    <RenderHealthStatus
                      item={health.elasticsearch}
                      requiresMargin={true}
                    />
                  </h2>
                </div>
                <div className="card height-8">
                  <h2 className="margin-top-2 margin-left-2 grid-row">
                    <div className="grid-col-9">Email Service</div>
                    <RenderHealthStatus
                      item={health.emailService}
                      requiresMargin={true}
                    />
                  </h2>
                </div>
              </div>
              <div className="grid-col-3">
                <div className="card height-card">
                  <h2 className="margin-top-2 margin-left-205">s3 public</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">client</div>
                    <RenderHealthStatus item={health.s3.public} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      clientFailover
                    </div>
                    <RenderHealthStatus item={health.s3.publicFailover} />
                  </div>
                </div>
                <div className="card height-card">
                  <h2 className="margin-top-2 margin-left-205">s3 east</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text  grid-col-9">
                      documents
                    </div>
                    <RenderHealthStatus item={health.s3.eastDocuments} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text  grid-col-9">
                      tempDocuments
                    </div>
                    <RenderHealthStatus item={health.s3.eastTempDocuments} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text  grid-col-9">
                      quarantine
                    </div>
                    <RenderHealthStatus item={health.s3.eastQuarantine} />
                  </div>
                </div>
              </div>
              <div className="grid-col-3">
                <div className="card height-card">
                  <h2 className="margin-top-2 margin-left-205">s3 app</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">client</div>
                    <RenderHealthStatus item={health.s3.app} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      clientFailover
                    </div>
                    <RenderHealthStatus item={health.s3.appFailover} />
                  </div>
                </div>
                <div className="card height-card">
                  <h2 className="margin-top-2 margin-left-205">s3 west</h2>
                  <hr />
                  <div className="margin-left-205 margin-top-negative grid-row">
                    <div className="health-check-text grid-col-9">
                      documents
                    </div>
                    <RenderHealthStatus item={health.s3.westDocuments} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      tempDocuments
                    </div>
                    <RenderHealthStatus item={health.s3.westTempDocuments} />
                  </div>
                  <div className="margin-left-205 margin-bottom-205 grid-row">
                    <div className="health-check-text grid-col-9">
                      quarantine
                    </div>
                    <RenderHealthStatus item={health.s3.westQuarantine} />
                  </div>
                </div>
              </div>
            </div>
          </NonMobile>
          <Mobile>
            <div className="grid-row">
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-205 grid-row">
                  <div className="grid-col-9">ClamAV</div>
                  <RenderHealthStatus
                    item={health.clamAV}
                    requiresMargin={true}
                  />
                </h2>
              </div>
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-205 grid-row">
                  <div className="grid-col-9"> Cognito</div>
                  <RenderHealthStatus
                    item={health.cognito}
                    requiresMargin={true}
                  />
                </h2>
              </div>
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-205 grid-row">
                  <div className="grid-col-9"> Dynamsoft</div>
                  <RenderHealthStatus
                    item={health.dynamsoft}
                    requiresMargin={true}
                  />
                </h2>
              </div>
            </div>
            <div className="grid-row">
              <div className="card height-card width-full">
                <h2 className="margin-top-2 margin-left-205">DynamoDB</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">efcms</div>
                  <RenderHealthStatus item={health.dynamo.efcms} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    efcmsDeploy
                  </div>
                  <RenderHealthStatus item={health.dynamo.efcmsDeploy} />
                </div>
              </div>

              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-2 grid-row">
                  <div className="grid-col-9"> ElasticSearch</div>
                  <RenderHealthStatus
                    item={health.elasticsearch}
                    requiresMargin={true}
                  />
                </h2>
              </div>
              <div className="card height-8 width-full">
                <h2 className="margin-top-2 margin-left-2 grid-row">
                  <div className="grid-col-9"> Email Service</div>
                  <RenderHealthStatus
                    item={health.emailService}
                    requiresMargin={true}
                  />
                </h2>
              </div>
            </div>
            <div className="grid-row">
              <div className="card width-full height-card">
                <h2 className="margin-top-2 margin-left-205">s3 public</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">client</div>
                  <RenderHealthStatus item={health.s3.public} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    clientFailover
                  </div>
                  <RenderHealthStatus item={health.s3.publicFailover} />
                </div>
              </div>
              <div className="card width-full height-card">
                <h2 className="margin-top-2 margin-left-205">s3 east</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">documents</div>
                  <RenderHealthStatus item={health.s3.eastDocuments} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    tempDocuments
                  </div>
                  <RenderHealthStatus item={health.s3.eastTempDocuments} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">quarantine</div>
                  <RenderHealthStatus item={health.s3.eastQuarantine} />
                </div>
              </div>
            </div>
            <div className="grid-row">
              <div className="card  width-full height-card">
                <h2 className="margin-top-2 margin-left-205">s3 app</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">client</div>
                  <RenderHealthStatus item={health.s3.app} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    clientFailover
                  </div>
                  <RenderHealthStatus item={health.s3.appFailover} />
                </div>
              </div>
              <div className="card width-full height-card">
                <h2 className="margin-top-2 margin-left-205">s3 west</h2>
                <hr />
                <div className="margin-left-205 margin-top-negative grid-row">
                  <div className="health-check-text grid-col-9">documents</div>
                  <RenderHealthStatus item={health.s3.westDocuments} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">
                    tempDocuments
                  </div>
                  <RenderHealthStatus item={health.s3.westTempDocuments} />
                </div>
                <div className="margin-left-205 margin-bottom-205 grid-row">
                  <div className="health-check-text grid-col-9">quarantine</div>
                  <RenderHealthStatus item={health.s3.westQuarantine} />
                </div>
              </div>
            </div>
          </Mobile>
        </section>
      </>
    );
  },
);
