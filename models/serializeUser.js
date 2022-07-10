exports.serializeUser = (user) => {
  return {
    email: user.email,
    subscription: user.subscription,
  };
};

exports.serializeUserLogIn = (user, token) => {
  return {
    user: { email: user.email, subscription: user.subscription },
    token,
  };
};
