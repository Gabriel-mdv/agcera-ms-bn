import { SortDirectionEnum } from '@src/types/common.types';
import { GetAllRequestQuery } from '@src/types/sales.types';

// Throws an error if the sort query is invalid
export const formatSortQuery = (data: string): GetAllRequestQuery['sort'] => {
  const sorts = data.split(',').map((sort) => sort.trim());
  const sortQuery: GetAllRequestQuery['sort'] = {};

  for (const sort of sorts) {
    if (!sort.includes(':')) {
      throw new Error('Invalid sort query, must be in the format key:(ASC or DESC)]');
    }
    const [key, value] = sort.split(':').map((sort) => sort.trim());
    const direction = Object.values(SortDirectionEnum).find((sort) => sort === value.toUpperCase());
    direction && (sortQuery[key] = direction);
  }

  return sortQuery;
};
