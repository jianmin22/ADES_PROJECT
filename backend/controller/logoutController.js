
const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.accessTokenJwt && !cookies?.refreshTokenJwt) return res.sendStatus(204); //No content

    res.clearCookie('accessTokenjJwt', { httpOnly: true, sameSite: 'Strict'});
    res.clearCookie('refreshTokenJwt', { httpOnly: true, sameSite: 'Strict'});
    res.sendStatus(204);
}

module.exports = { handleLogout }