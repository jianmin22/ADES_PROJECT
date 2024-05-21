const jwt = require('jsonwebtoken')
const pool = require("../config/databaseConfig");

// FOR CA2
const handleRefreshToken = async (req, res) => {

    console.log("handleRefreshToken")

    const cookies = req.cookies

    // if there is no jwt
    if (!cookies?.refreshTokenJwt)
        return res.sendStatus(403)

    const refreshToken = cookies.refreshTokenJwt

    // after we get the data out of the cookie, we clear it
    res.clearCookie('refreshTokenJwt', {
        httpOnly: true,
        sameSite: 'Strict'
    })
    // evaluate jwt

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => { // eg expiry

        if (err) {
            console.log("There was an err, expiry? refreshTokenConrtoller")
            return res.sendStatus(403)
        }

        const userId = decoded.userId

        const getUserRoleQuery = ` SELECT role FROM ades_project.User WHERE userId = ?;`
        const [roles, columns] = await pool.query(getUserRoleQuery, [userId])

        if (!roles || roles.length === 0 || !roles[0].role) {
            return res.sendStatus(403)
          }
          
          const role = roles[0].role
          console.log("This is the role" + role)
          

        if(!role){
            return res.sendStatus(403)
        }

        const accessToken = jwt.sign({
            "UserInfo": {
                "userId": userId,
                "role": role
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

        const refreshToken = jwt.sign({
            userId: userId
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});

        res.cookie('refreshTokenJwt', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24*60*60*1000
            // for a day
        })

        

        res.json({userId, role, accessToken})
    })

}

module.exports = {
    handleRefreshToken
}