import express from 'express'
const router = express.Router();

import usersRouter from "./user/usersRouter.js";

// user Router
router.use('/user', usersRouter);


export default router
