import express from 'express';
import {
  login,
  signUp,
  logout,
  refreshToken,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh_token', refreshToken);

export default router;
