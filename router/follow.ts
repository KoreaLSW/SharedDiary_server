import express from 'express';
import multer from 'multer';

import * as followController from '../controller/follow';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.get('/follower', isAuth, followController.getFollower);
router.get('/following', isAuth, followController.getFollowing);

router.get('/check', isAuth, followController.getFollowCheck);

router.post('/', isAuth, followController.createFollow);

router.delete('/', isAuth, followController.removeFollow);

export default router;
