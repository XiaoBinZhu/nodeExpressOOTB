import express from 'express';
const router = express.Router();
import users from "../../controllers/user/user.js";

// wx
router.get('/wxGetSessionKey', users.wxGetSessionKey);
router.post('/wxEncryptedData', users.wxEncryptedData);

export default router;