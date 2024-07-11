export class ListApiQueryDto {
  skip = 0;
  take = 10;

  include: string[] = null;

  pageNumber = 0;

  searchTerm: string = null;

  pagination: boolean = null;
}
