export class PublicDocumentDownloadUrlDTO {
  entityName: 'PublicDocumentDownloadUrlDTO' = 'PublicDocumentDownloadUrlDTO';
  url: string;

  constructor(data: { url: string }) {
    this.url = data.url;
    this.entityName = 'PublicDocumentDownloadUrlDTO';
  }
}
