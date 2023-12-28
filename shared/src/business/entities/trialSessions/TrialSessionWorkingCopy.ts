import { DOCKET_NUMBER_MATCHER } from '../EntityConstants';
import { ExcludeMethods } from 'types/TEntity';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

export class TrialSessionWorkingCopy extends JoiValidationEntity {
  public caseMetadata: { [docketNumber: string]: { trialStatus: string } };
  public filters: {
    basisReached: boolean;
    continued: boolean;
    definiteTrial: boolean;
    dismissed: boolean;
    motionToDismiss: boolean;
    probableSettlement: boolean;
    probableTrial: boolean;
    recall: boolean;
    rule122: boolean;
    setForTrial: boolean;
    settled: boolean;
    showAll: boolean;
    statusUnassigned: boolean;
    submittedCAV: boolean;
  };
  public sessionNotes: string;
  public sort: string;
  public sortOrder: string;
  public trialSessionId: string;
  public userId: string;

  constructor(rawSession) {
    super('TrialSessionWorkingCopy');

    this.caseMetadata = rawSession.caseMetadata || {};
    this.filters = rawSession.filters || {
      basisReached: true,
      continued: true,
      definiteTrial: true,
      dismissed: true,
      motionToDismiss: true,
      probableSettlement: true,
      probableTrial: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      submittedCAV: true,
    };
    this.sessionNotes = rawSession.sessionNotes;
    this.sort = rawSession.sort;
    this.sortOrder = rawSession.sortOrder;
    this.trialSessionId = rawSession.trialSessionId;
    this.userId = rawSession.userId;
  }

  getValidationRules() {
    return {
      caseMetadata: joi
        .object()
        .pattern(
          DOCKET_NUMBER_MATCHER, // keys are docket numbers
          joi.object().keys({
            trialStatus: joi.string().allow(''),
          }),
        )
        .optional(),
      entityName: JoiValidationConstants.STRING.valid(
        'TrialSessionWorkingCopy',
      ).required(),
      filters: joi
        .object()
        .keys({
          basisReached: joi.boolean().required(),
          continued: joi.boolean().required(),
          definiteTrial: joi.boolean().required(),
          dismissed: joi.boolean().required(),
          motionToDismiss: joi.boolean().required(),
          probableSettlement: joi.boolean().required(),
          probableTrial: joi.boolean().required(),
          recall: joi.boolean().required(),
          rule122: joi.boolean().required(),
          setForTrial: joi.boolean().required(),
          settled: joi.boolean().required(),
          showAll: joi.boolean().required(),
          statusUnassigned: joi.boolean().required(),
          submittedCAV: joi.boolean().required(),
        })
        .required(),
      sessionNotes: JoiValidationConstants.STRING.optional(),
      sort: JoiValidationConstants.STRING.optional(),
      sortOrder: JoiValidationConstants.STRING.optional(),
      trialSessionId: JoiValidationConstants.UUID.required(),
      userId: JoiValidationConstants.UUID.required(),
    };
  }
}

export type RawTrialSessionWorkingCopy =
  ExcludeMethods<TrialSessionWorkingCopy>;
