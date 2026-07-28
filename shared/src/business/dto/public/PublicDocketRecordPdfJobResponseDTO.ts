export class PublicDocketRecordPdfJobResponseDTO {
  entityName: 'PublicDocketRecordPdfJobResponseDTO' =
    'PublicDocketRecordPdfJobResponseDTO';
  status?: 'pending' | 'ready' | 'error';
  jobId?: string;
  url?: string;
  message?: string;
  statusCode?: number;

  constructor(data: {
    status?: 'pending' | 'ready' | 'error';
    jobId?: string;
    url?: string;
    message?: string;
    statusCode?: number;
  }) {
    this.status = data.status;
    this.jobId = data.jobId;
    this.url = data.url;
    this.message = data.message;
    this.statusCode = data.statusCode;
    this.entityName = 'PublicDocketRecordPdfJobResponseDTO';
  }
}
