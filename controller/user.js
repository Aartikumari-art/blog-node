const {userModel} = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await userModel.create({ name, email, password });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ message: "User registered", data: userObj });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id , email:user.email}, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



