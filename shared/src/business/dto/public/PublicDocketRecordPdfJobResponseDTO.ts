export class PublicDocketRecordPdfJobResponseDTO {
  entityName: 'PublicDocketRecordPdfJobResponseDTO' =
    'PublicDocketRecordPdfJobResponseDTO';
  jobId: string;

  constructor(data: { jobId: string }) {
    this.jobId = data.jobId;
    this.entityName = 'PublicDocketRecordPdfJobResponseDTO';
  }
}
