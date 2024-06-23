import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { patchContactSchema } from '../validation/patchContactSchema.js';

const router = Router();

router.use('/contacts/:contactId', validateMongoId());

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  validateBody(patchContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
