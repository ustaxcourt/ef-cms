import { BigHeader } from '../BigHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const RenderHealthStatus = ({ item, requiresMargin = false }) => {
  return (
    <span
      className={classNames(
        'float-right margin-right-205',
        requiresMargin && 'margin-top-05',
      )}
    >
      <h4 className="text-light font-sans-pro">
        {item ? 'Pass' : 'Fail'}{' '}
        <FontAwesomeIcon
          className="margin-left-1"
          color={item ? 'green' : 'red'}
          icon={item ? 'check-circle' : 'times-circle'}
          size="lg"
        />
      </h4>
    </span>
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
          <div className="grid-row grid-gap">
            <div className="grid-col-3">
              <div className="card height-8">
                <h2 className="margin-top-2 margin-left-205">
                  ClamAV
                  <RenderHealthStatus
                    item={health.clamAV}
                    requiresMargin={true}
                  />
                </h2>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-2 margin-left-205">
                  Cognito
                  <RenderHealthStatus
                    item={health.cognito}
                    requiresMargin={true}
                  />
                </h2>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-2 margin-left-205">
                  Dynamsoft
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
                <p className="margin-left-205 margin-top-negative">
                  <span className="health-check-text">efcms</span>
                  <RenderHealthStatus item={health.efcms} />
                </p>
                <p className="margin-left-205 margin-bottom-205">
                  <span className="health-check-text">efcmsDeploy</span>
                  <RenderHealthStatus item={health.efcmsDeploy} />
                </p>
              </div>

              <div className="card height-8">
                <h2 className="margin-top-2 margin-left-2">
                  ElasticSearch
                  <RenderHealthStatus
                    item={health.elasticsearch}
                    requiresMargin={true}
                  />
                </h2>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-2 margin-left-2">
                  Email Service
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
                <p className="margin-left-205 margin-top-negative">
                  <span className="health-check-text">client</span>
                  <RenderHealthStatus item={health.publicS3Bucket} />
                </p>
                <p className="margin-left-205 margin-bottom-205">
                  <span className="health-check-text">clientFailover</span>
                  <RenderHealthStatus item={health.publicFailoverS3Bucket} />
                </p>
              </div>
              <div className="card height-card">
                <h2 className="margin-top-2 margin-left-205">s3 east</h2>
                <hr />
                <p className="margin-left-205 margin-top-negative">
                  <span className="health-check-text">documents</span>
                  <RenderHealthStatus item={health.eastS3BucketName} />
                </p>
                <p className="margin-left-205 margin-bottom-205">
                  <span className="health-check-text">tempDocuments</span>
                  <RenderHealthStatus item={health.eastS3TempBucketName} />
                </p>
              </div>
            </div>
            <div className="grid-col-3">
              <div className="card height-card">
                <h2 className="margin-top-2 margin-left-205">s3 app</h2>
                <hr />
                <p className="margin-left-205 margin-top-negative">
                  <span className="health-check-text">client</span>
                  <RenderHealthStatus item={health.appS3Bucket} />
                </p>
                <p className="margin-left-205 margin-bottom-205">
                  <span className="health-check-text">clientFailover</span>
                  <RenderHealthStatus item={health.appFailoverS3Bucket} />
                </p>
              </div>
              <div className="card height-card">
                <h2 className="margin-top-2 margin-left-205">s3 west</h2>
                <hr />
                <p className="margin-left-205 margin-top-negative">
                  <span className="health-check-text">documents</span>
                  <RenderHealthStatus item={health.westS3BucketName} />
                </p>
                <p className="margin-left-205 margin-bottom-205">
                  <span className="health-check-text">tempDocuments</span>
                  <RenderHealthStatus item={health.westS3TempBucketName} />
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
