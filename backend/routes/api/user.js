const express = require('express');
const router = express.Router();
const {
    userAddress,
    userPersonal,
    userName,
    updateUserPersonalInfo,
    comparePwd,
    updateAddr,
    addAddr,
    addAddrUser,
    deleteUserAddr,
    deleteeaddr,
    deleteUser,
    userSpecificAdd,
    dateJoined,
} = require('../../models/user');
const verifyRoles = require('../../middleware/verifyRoles');

router
    .get('/personal', verifyRoles(["customer", "admin", "admin"]), userPersonal)
    .get('/address', verifyRoles(["customer", "admin", "admin"]), userAddress)
    .get('/dateJoined', verifyRoles(["customer", "admin", "admin"]), dateJoined)
    .get('/useradd/:addrId', verifyRoles(["customer", "admin", "admin"]), userSpecificAdd)
    .get('/name', verifyRoles(["customer", "admin", "admin"]), userName)
    .put('/updatepersonal', verifyRoles(["customer", "admin", "admin"]), updateUserPersonalInfo)
    .post('/checkpwd', verifyRoles(["customer", "admin", "admin"]), comparePwd)
    .put('/updateaddr', verifyRoles(["customer", "admin", "admin"]), updateAddr)
    .post('/addaddr', verifyRoles(["customer", "admin", "admin"]), addAddr)
    .post('/addaddruser', verifyRoles(["customer", "admin", "admin"]), addAddrUser)
    .delete('/deleteaddr', verifyRoles(["customer", "admin", "admin"]), deleteeaddr)
    .delete('/deleteuseraddr', verifyRoles(["customer", "admin", "admin"]), deleteUserAddr)
    .delete('/deleteuser', verifyRoles(["customer", "admin", "admin"]), deleteUser)

module.exports = router;
