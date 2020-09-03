import { BigHeader } from '../BigHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const RenderHealthStatus = ({ item }) => {
  return (
    <span className="float-right margin-right-205">
      <h4 className="text-light">
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
        {console.log(health)}
        <BigHeader text="Health Check" />
        <section className="usa-section grid-container">
          <div className="grid-row grid-gap">
            <div className="grid-col-3">
              <div className="card height-8">
                <h2 className="margin-top-205 margin-left-205">
                  ClamAV
                  <RenderHealthStatus item={health.clamAV} />
                </h2>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-205 margin-left-205">
                  Cognito
                  <RenderHealthStatus item={health.cognito} />
                </h2>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-205 margin-left-205">
                  Dynamsoft
                  <RenderHealthStatus item={health.dynamsoft} />
                </h2>
              </div>
            </div>
            <div className="grid-col-3">
              <div>
                Dynamo
                <div className="margin-bottom-1 margin-top-1 margin-left-1">
                  EFCMS
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.dynamo.efcms ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  EFCMS Deploy
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.dynamo.efcmsDeploy ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-205 margin-left-2">
                  ElasticSearch
                  <RenderHealthStatus item={health.elasticsearch} />
                </h2>
              </div>
              <div className="card height-8">
                <h2 className="margin-top-205 margin-left-2">
                  Email Service
                  <RenderHealthStatus item={health.emailService} />
                </h2>
              </div>
            </div>
            <div className="grid-col-3">
              <div>
                S3
                <div className="margin-bottom-1 margin-top-1 margin-left-1">
                  East Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.eastS3BucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  West Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.westS3BucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  East Temp Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.eastS3TempBucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  West Temp Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.westS3TempBucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  App
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.appS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  Public
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.publicS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  Public Failover
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.publicFailoverS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-left-1">
                  App Failover
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.appFailoverS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
              </div>
            </div>
            <div className="grid-col-3"></div>
          </div>
        </section>
      </>
    );
  },
);
