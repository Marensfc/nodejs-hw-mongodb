const parseType = (type) => {
  const isKnownType = ['work', 'home', 'personal'].includes(type);

  if (isKnownType) return type;

  return null;
};

const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';

  if (!isString) return null;

  const isKnownValue = ['true', 'false'].includes(isFavourite);

  if (isKnownValue && isFavourite === 'true') return true;
  if (isKnownValue && isFavourite === 'false') return false;

  return null;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  console.log(contactType);

  const parsedContactType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  const filter = {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };

  return filter;
};
