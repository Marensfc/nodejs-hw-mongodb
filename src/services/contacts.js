import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  user,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({
    userId: user._id,
  });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite === true || filter.isFavourite === false) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, user) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: user._id,
  });
  return contact;
};

export const createContact = async (payload, user) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId: user._id,
  });
  return contact;
};

export const patchContact = async (
  { contactId, user },
  update,
  options = {},
) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId: user._id,
    },
    update,
    {
      new: true,
      ...options,
    },
  );

  return contact;
};

export const deleteContact = async (contactId, user) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: user._id,
  });

  return contact;
};
