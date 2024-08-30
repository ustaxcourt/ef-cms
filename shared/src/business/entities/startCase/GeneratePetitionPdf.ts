import { CASE_TYPES, PARTY_TYPES, PROCEDURE_TYPES } from '../EntityConstants';
import {
  Contact,
  ContactCounsel,
  ContactSecondary,
  IrsNotice,
} from '@shared/business/useCases/generatePetitionPdfInteractor';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class GeneratePetitionPdf extends JoiValidationEntity {
  public caseCaptionExtension: string;
  public caseTitle: string;
  public contactPrimary: Contact;
  public contactSecondary?: ContactSecondary;
  public contactCounsel?: ContactCounsel;
  public hasUploadedIrsNotice: boolean;
  public partyType: string;
  public petitionFacts: string[];
  public petitionReasons: string[];
  public preferredTrialCity: string;
  public procedureType: string;
  public hasIrsNotice: boolean;
  public originalCaseType: string;
  public irsNotices: IrsNotice[];

  constructor(rawProps) {
    super('GeneratePetitionPdf');

    this.caseCaptionExtension = rawProps.caseCaptionExtension;
    this.caseTitle = rawProps.caseTitle;
    this.contactPrimary = rawProps.contactPrimary;
    this.contactSecondary = rawProps.contactSecondary;
    this.contactCounsel = rawProps.contactCounsel;
    this.hasUploadedIrsNotice = rawProps.hasUploadedIrsNotice;
    this.partyType = rawProps.partyType;
    this.petitionFacts = rawProps.petitionFacts;
    this.petitionReasons = rawProps.petitionReasons;
    this.preferredTrialCity = rawProps.preferredTrialCity;
    this.procedureType = rawProps.procedureType;
    this.hasIrsNotice = rawProps.hasIrsNotice;
    this.originalCaseType = rawProps.originalCaseType;
    this.irsNotices = rawProps.irsNotices;
  }

  static VALIDATION_RULES = {
    caseCaptionExtension: joi.string().required(),
    caseTitle: joi.string().required(),
    contactCounsel: joi.object().optional(),
    contactPrimary: joi.object().required(),
    contactSecondary: joi.object().optional(),
    hasIrsNotice: joi.boolean().required(),
    hasUploadedIrsNotice: joi.boolean().required(),
    irsNotices: joi.array(),
    originalCaseType: JoiValidationConstants.STRING.valid(
      ...CASE_TYPES,
      'Disclosure1',
      'Disclosure2',
    ).required(),
    partyType: JoiValidationConstants.STRING.valid(
      ...Object.values(PARTY_TYPES),
    ),
    petitionFacts: joi.array().min(1).items(joi.string()).required(),
    petitionReasons: joi.array().min(1).items(joi.string()).required(),
    preferredTrialCity: joi.string().required(),
    procedureType: JoiValidationConstants.STRING.valid(
      ...PROCEDURE_TYPES,
    ).required(),
  };

  getValidationRules() {
    return GeneratePetitionPdf.VALIDATION_RULES;
  }
}

export type RawGeneratePetitionPdf = ExcludeMethods<
  Omit<GeneratePetitionPdf, 'entityName'>
>;
