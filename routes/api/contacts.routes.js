const express = require("express");
const contactsRouter = express.Router();

const { tokenMiddleware } = require("../../middleware/tokenMiddleware");

const asyncWrapper = require("../../utils/asyncWrapper");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../controller/contacts.controller");

const { postValidate, updateValidate } = require("../../middleware/validate");

contactsRouter.get("/", tokenMiddleware, asyncWrapper(listContacts));

contactsRouter.get(
  "/:contactId",
  tokenMiddleware,
  asyncWrapper(getContactById)
);

contactsRouter.post(
  "/",
  tokenMiddleware,
  postValidate,
  asyncWrapper(addContact)
);

contactsRouter.delete(
  "/:contactId",
  tokenMiddleware,
  asyncWrapper(removeContact)
);

contactsRouter.put(
  "/:contactId",
  tokenMiddleware,
  updateValidate,
  asyncWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  tokenMiddleware,
  asyncWrapper(updateStatusContact)
);

module.exports = contactsRouter;
