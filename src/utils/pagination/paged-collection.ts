export class PagedCollection<Entity> {
  currentPageNumber: number;
  recordsPerPage: number;
  totalRecords: number;
  totalPages: number;
  items: (Entity | [])[];
  recordRange?: string;

  constructor(
    recordsToSkip: number,
    recordsPerPage: number,
    totalRecords: number,
    items: (Entity | [])[],
  ) {
    this.items = items;
    this.recordsPerPage = parseInt(recordsPerPage.toString());
    this.totalRecords = totalRecords;
    this.currentPageNumber = this.getCurrentPageNumber(
      recordsToSkip,
      recordsPerPage,
    );
    this.totalPages = this.getTotalPages();
    this.recordRange = this.getCurrentRecordRange(
      recordsToSkip,
      recordsPerPage,
      totalRecords,
      this.totalPages,
    );
  }

  private getCurrentPageNumber(skip: number, recordsPerPage: number): number {
    if (recordsPerPage > 0) {
      return Math.floor(skip / recordsPerPage) + 1;
    }

    recordsPerPage = 25;
    return Math.floor(skip / recordsPerPage) + 1;
  }

  private getTotalPages(): number {
    if (this.recordsPerPage > 0) {
      return Math.floor(
        (this.totalRecords + this.recordsPerPage - 1) / this.recordsPerPage,
      );
    }

    return 1;
  }

  private getCurrentRecordRange(
    skip: number,
    recordsPerPage: number,
    totalRecords: number,
    totalPages: number,
  ): string {
    recordsPerPage = parseInt(recordsPerPage.toString());
    skip = parseInt(skip.toString());
    const firstRecord: number = skip + 1;
    const lastRecord: number = skip + recordsPerPage;

    // if()
    if (totalRecords <= skip) {
      return '1 - 10';
    }
    if (totalPages === 1) {
      return `1 - ${totalRecords}`;
    }

    if (totalRecords <= lastRecord) {
      return `${firstRecord} - ${totalRecords}`;
    }

    return `${firstRecord} - ${lastRecord}`;
  }
}
