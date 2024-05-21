const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {

    if (!req?.role) {
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];
    const currentUserRole = req.role;

    console.log("verifyRoles.js is running, CURRENT ROLE:" + currentUserRole + "on the url: " + req.url);

    const result = allowedRoles.includes(currentUserRole);

    if (!result) {
      console.log("ERR ON ROLES");
      return res.sendStatus(401);
    }

    next();
  };
};

module.exports = verifyRoles;
