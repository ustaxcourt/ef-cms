import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import type { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import type { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import joi from 'joi';

type PublicCalendaredCase = PublicCaseDTO | RestrictedCaseDTO;

export class PublicTrialSessionDetails extends JoiValidationEntity {
  public address1?: string;
  public address2?: string;
  public calendaredCases: PublicCalendaredCase[];
  public city?: string;
  public courthouseName?: string;
  public postalCode?: string;
  public startDate: string;
  public state?: string;
  public swingSessionId?: string;
  public swingSessionLocation?: string;
  public trialLocation?: string;

  constructor(rawTrialSession) {
    super('PublicTrialSessionDetails');

    this.address1 = rawTrialSession.address1;
    this.address2 = rawTrialSession.address2;
    this.calendaredCases = rawTrialSession.calendaredCases || [];
    this.city = rawTrialSession.city;
    this.courthouseName = rawTrialSession.courthouseName;
    this.postalCode = rawTrialSession.postalCode;
    this.startDate = rawTrialSession.startDate;
    this.state = rawTrialSession.state;
    this.swingSessionId = rawTrialSession.swingSessionId;
    this.swingSessionLocation = rawTrialSession.swingSessionLocation;
    this.trialLocation = rawTrialSession.trialLocation;
  }

  static VALIDATION_RULES = {
    address1: JoiValidationConstants.STRING.optional().allow(''),
    address2: JoiValidationConstants.STRING.optional().allow(''),
    calendaredCases: joi.array().items(joi.object()).required(),
    city: JoiValidationConstants.STRING.optional().allow(''),
    courthouseName: JoiValidationConstants.STRING.optional().allow(''),
    postalCode: JoiValidationConstants.STRING.optional().allow(''),
    startDate: JoiValidationConstants.ISO_DATE.required(),
    state: JoiValidationConstants.STRING.optional().allow(''),
    swingSessionId: JoiValidationConstants.UUID.optional().allow(null),
    swingSessionLocation: JoiValidationConstants.STRING.optional().allow(''),
    trialLocation: JoiValidationConstants.STRING.optional().allow(''),
  } as const;

  getValidationRules() {
    return PublicTrialSessionDetails.VALIDATION_RULES;
  }
}

export type RawPublicTrialSessionDetails =
  ExcludeMethods<PublicTrialSessionDetails>;
