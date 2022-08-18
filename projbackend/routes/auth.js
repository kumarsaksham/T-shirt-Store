const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout,signup, signin, isSignedIn } = require('../controllers/auth');


// route -> validation -> controller
router.post (
    '/signup',
    [
        check('name').isLength({ min: 3 }).withMessage('Name must be at least 3 character long'),
        check('email').isEmail().withMessage('Enter valid email id'),
        check('password').isLength({ min: 3 }).withMessage('Password must be at least 3 character long')
    ],
    signup
);

router.post (
    '/signin',
    [
        check('email').isEmail().withMessage('Enter valid email id'),
        check('password').isLength({ min: 3 }).withMessage('Password must be at least 3 character long')
    ],
    signin
);

router.get('/signout', signout);


// router.get('/testroute', isSignedIn, (req,res)=>{
//     res.json(req.auth);
// })

module.exports = router;
