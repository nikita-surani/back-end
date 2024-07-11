
export function PaginationSearchTerm(fields: Array<string>): object {
  return {
    required: false,
    name: 'searchTerm',
    description: `Search By: [ ${fields.join(', ')} ]`,
  };
}

export const PaginationSkip = {
  name: 'skip',
  required: false,
  example: 0,
  description: 'Records to skip',
};

export const PaginationTake = {
  name: 'take',
  required: false,
  example: 10,
  description: 'Records to take',
};

export const PageNumber = {
  name: 'pageNumber',
  required: false,
  example: 0,
  description: 'Page to jump',
};
