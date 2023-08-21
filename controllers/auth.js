const { StatusCodes } = require("http-status-codes");
const User = require("../model/User");
const { BadRequest, UnauthorizedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid Creadentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Creadentials");
  }

  const token = user.createJWT();
  const userWithoutPassword = { ...user._doc };
  delete userWithoutPassword.password;
  res.status(StatusCodes.OK).json({ user: userWithoutPassword, token });
};

module.exports = {
  register,
  login,
};
