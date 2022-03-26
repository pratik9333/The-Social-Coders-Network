const getCookieToken = (user, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //restricting data to pass on frontend
  user.password = undefined;
  user.__v = undefined;
  user.createdAt = undefined;

  res.status(200).cookie("token", token, options).json({
    success: true,
    token: token,
    user,
  });
};

module.exports = getCookieToken;
