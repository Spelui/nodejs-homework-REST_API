const contactModel = require("../db/contactModel");
const { NotFound, Conflict } = require("http-errors");

const listContacts = async () => {
  try {
    const contacts = await contactModel.find({});
    return contacts;
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contactById = await contactModel.findById(contactId);
    return contactById;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await contactModel.deleteOne({ _id: contactId });
    if (contacts.deletedCount === 0) {
      throw new NotFound(`User with id '${contactId}' not found`);
    }

    return { message: "Contact deleted", status: 200 };
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (body) => {
  const existingUser = await contactModel.findOne({ email: body.email });
  if (existingUser) {
    throw new Conflict(`User with such email "${body.email}" already exists`);
  }
  return await contactModel.create(body);
};

const updateContact = async (contactId, body) => {
  try {
    const existingUser = await contactModel.findById(contactId);

    if (!existingUser) {
      throw new NotFound(`User with id '${contactId}' not found`);
    }

    return await contactModel.findByIdAndUpdate(contactId, body);
  } catch (error) {
    console.error(error);
  }
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  try {
    await contactModel.findByIdAndUpdate(contactId, { $set: { favorite } });
    return await contactModel.findById(contactId);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
