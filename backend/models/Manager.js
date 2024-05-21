const pool = require("../config/databaseConfig");

module.exports.deleteUser = async function deleteUser(userId, requestingUser) {
  try {
    // Check if requesting user is a super admin
    const checkSuperAdminSql = `SELECT * FROM User WHERE userId = ? AND role = 'supermanager'`;
    const [checkSuperAdminResult, _] = await pool.query(checkSuperAdminSql, [
      requestingUser,
    ]);
    console.log(requestingUser);
    console.log(checkSuperAdminResult);
    if (checkSuperAdminResult.length > 0) {
      // Requesting user is a super admin, proceed with delete
      const deleteSql = `DELETE FROM User WHERE userId = ?`;
      const [deleteResult, deleteFields] = await pool.query(deleteSql, [
        userId,
      ]);
      return deleteResult;
    } else {
      // Requesting user is not a super admin, throw error
      throw new Error("User does not have permission to delete other users.");
    }
  } catch (error) {
    console.error(`Error in deleteUser: ${error.message}`);
    throw error;
  }
};

module.exports.allManagers = async function allManagers() {
  try {
    const sql = `SELECT * FROM User WHERE role = 'manager'`;
    const [result, _] = await pool.query(sql);
    return result;
  } catch (error) {
    console.error(`Error in allManagers: ${error.message}`);
    throw error;
  }
};

module.exports.updateUser = async function updateUser(userId, requestingUser) {
  try {
    // Check if requesting user is a super admin
    const checkSuperAdminSql = `SELECT * FROM User WHERE userId = ? AND role = 'supermanager'`;
    const [checkSuperAdminResult, _] = await pool.query(checkSuperAdminSql, [
      requestingUser,
    ]);
    console.log(requestingUser);
    console.log(checkSuperAdminResult);
    if (checkSuperAdminResult.length > 0) {
      // Requesting user is a super admin, proceed with delete
      const deleteSql = `DELETE FROM User WHERE userId = ?`;
      const [deleteResult, deleteFields] = await pool.query(deleteSql, [
        userId,
      ]);
      return deleteResult;
    } else {
      // Requesting user is not a super admin, throw error
      throw new Error("User does not have permission to delete other users.");
    }
  } catch (error) {
    console.error(`Error in deleteUser: ${error.message}`);
    throw error;
  }
};

async function isUserAuthorizedToUpdate(userRole, targetUserId) {
  // Check if the requesting user is a super manager
  const checkSuperManagerSql = `SELECT * FROM User WHERE userId = ? AND role = 'supermanager'`;
  const [checkSuperManagerResult, _] = await pool.query(checkSuperManagerSql, [
    userRole,
  ]);

  if (checkSuperManagerResult.length > 0) {
    // The requesting user is a super manager, they can update any user
    return true;
  } else if (userRole === "manager") {
    // The requesting user is a manager, they can only update normal users
    const checkUserSql = `SELECT * FROM User WHERE userId = ? AND role = 'customer'`;
    const [checkUserResult, __] = await pool.query(checkUserSql, [
      targetUserId,
    ]);
    return checkUserResult.length > 0;
  } else {
    // The requesting user is not authorized
    return false;
  }
}

module.exports.updateUser = async function updateUser(
  targetUserId,
  newValues,
  requestingUser
) {
  try {
    // Get the current user values from the database
    const getCurrentValuesSql = `SELECT * FROM user WHERE userId = ?`;
    const [currentValues, _] = await pool.query(getCurrentValuesSql, [
      targetUserId,
    ]);

    // Check if the requesting user is authorized to update the user
    const isAuthorized = await isUserAuthorizedToUpdate(
      requestingUser,
      targetUserId
    );

    // If the requesting user is not authorized to update the user, throw an error
    if (!isAuthorized) {
      throw new Error("User is not authorized to update this user.");
    }

    // Update the user with the new values
    const updatedValues = Object.assign(currentValues[0], newValues);
    const updateEntitySql = `UPDATE user SET username = ? WHERE userId = ?`;
    const [result, __] = await pool.query(updateEntitySql, [
      updatedValues.name,
      targetUserId,
    ]);

    // Return the updated user
    const getUpdatedEntitySql = `SELECT * FROM user WHERE userId = ?`;
    const [updatedUser, ___] = await pool.query(getUpdatedEntitySql, [
      targetUserId,
    ]);
    return updatedUser[0];
  } catch (error) {
    console.error(`Error in updateEntity: ${error.message}`);
    throw error;
  }
};
