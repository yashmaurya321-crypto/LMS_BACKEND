const express = require('express');
const router = express.Router();
const User = require('../model/Users')
const {loginUser, userRegister,rgenerateRefreshToken,getUser,logut } = require('../controllers/UserController')
const { verifyAccessToken } = require('../controllers/AuthController')

router.get('/',verifyAccessToken, getUser)
router.post('/register', userRegister);
router.post('/login', loginUser);
router.post('/logout',verifyAccessToken, logut);
router.get('/users', verifyAccessToken, async(req, res) => {
    const data = await User.find();
    console.log("all users ",data);
    res.send(data);
});
module.exports = router;