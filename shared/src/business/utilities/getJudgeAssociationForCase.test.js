import { getJudgeAssociationForCase } from './getJudgeAssociationForCase';

describe('getJudgeAssociationForCase', () => {
  it('should return Chief Judge for a new case when a petition is filed but not served on the IRS', () => {});
  it('should return Chief Judge for a case in Batched for IRS where a petition has been QC`ed and is waiting to be served on the IRS', () => {});
  it('should return Chief Judge for a case that has been recalled from Batched Service', () => {});
  it('should return Chief Judge for a case in General Docket - Not at Issue and a petition has been successfully served on the IRS', () => {});
  it('should return Chief Judge for a case in General Docket - At Issue (RFT) and the petition and an answer type doc have been filed at or greater than 45 days ago', () => {});
  it('should return Judge assigned to trial session when a case is calendared for a trial session ', () => {});
  it('should return [Docket Assigned] for a case that has been submitted for a opinion/decision', () => {});
  it('should return [Docket Assigned] for a case where Rule 155 has been invoked and an opinion has been issued that calls for computations', () => {});
  it('should return [Docket Assigned] for a case that has a status of Jurisdiction Retained', () => {});
  it('should return [Docket Assigned] for a case that has a status of Assigned - Case where a case is assigned a judge for disposition', () => {});
  it('should return [Docket Assigned] for a case that has a status of Assigned - Motion where a motion is assigned a judge for disposition', () => {});
  it('should return the last associated Judge before closing when a case is Closed', () => {});
  it('should return the last associated Judge before appealing when a case is On Appeal having a party on the case that has filed a Notice of Appeal and the Court has not received a Mandate from a CoA', () => {});
});
