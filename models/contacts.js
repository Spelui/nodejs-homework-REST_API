const contactModel = require("../db/contactModel");
const { NotFound, Conflict } = require("http-errors");

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  let { page = 1, limit = 20, favorite } = req.query;
  let skip = 0;
  page = parseInt(page);
  limit = parseInt(limit);

  if (page === 1) {
    skip = 0;
  } else {
    skip = (page - 1) * limit;
  }

  const contacts = await contactModel
    .find({
      owner,
      favorite: favorite ? JSON.parse(favorite) : { $in: [true, false] },
    })
    .select({ __v: 0 })
    .skip(skip)
    .limit(limit);

  if (!contacts) {
    return res.status(400).json({ message: "Contacts not found" });
  }

  res.status(200).json({ contacts, page, limit });
};

const getContactById = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const contact = await contactModel.findOne({ owner, _id: contactId });

  if (!contact) {
    return res.status(400).json({ message: "Contact not found" });
  }

  res.status(200).json({ contact });
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await contactModel.deleteOne({ _id: contactId });
    if (contacts.deletedCount === 0) {
      throw new NotFound(`User with id '${contactId}' not found`);
    }

    return res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const { _id: owner } = req.user;
  const existingUser = await contactModel.findOne({ email });

  if (existingUser) {
    throw new Conflict(`User with such email "${email}" already exists`);
  }

  const body = {
    name,
    email,
    phone,
    favorite: favorite || false,
    owner,
  };
  await contactModel.create(body);
  return res.status(201).json({ body });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  if (!Object.keys(req.body)) {
    return res.status(400).json({ message: "missing fields" });
  }

  const existingUser = await contactModel.findById(contactId);
  if (!existingUser) {
    return res.status(400).json({ message: "missing fields" });
  }

  const uptContact = await contactModel.findByIdAndUpdate(contactId, req.body);
  return res.status(200).json({ ...uptContact });
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  if (!req.body) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const { favorite } = req.body;

  await contactModel.findByIdAndUpdate(contactId, {
    $set: { favorite },
  });
  const updStatus = await contactModel.findById(contactId);

  if (!updStatus) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json({ updStatus });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
