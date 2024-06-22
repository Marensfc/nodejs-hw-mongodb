const parseSortBy = (sortBy) => {
  const sortFields = [
    '_id',
    'name',
    'phoneNumber',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  const isKnownField = sortFields.includes(sortBy);

  if (isKnownField) return sortBy;

  return '_id';
};

const parseSortOrder = (sortOrder) => {
  const sortOrders = ['asc', 'desc'];

  const isKnownOrder = sortOrders.includes(sortOrder);

  if (isKnownOrder) return sortOrder;

  return 'asc';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
