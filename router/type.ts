import express from 'express';
//import 'express-async-errors';

import * as typeController from '../controller/type';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.get('/:type', typeController.getType);

export default router;
