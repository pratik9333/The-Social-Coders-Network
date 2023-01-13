const getCookieToken = (user, res) => {
  const token = user.getJwtToken();

  //restricting data to pass on frontend

  user.password = undefined;
  user.__v = undefined;
  user.social = null;
  user.createdAt = undefined;

  res.cookie("token", token, { maxAge: 900000, httpOnly: true });

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");

  res.status(200).json({
    success: true,
    token: token,
    user,
  });
};

module.exports = getCookieToken;
