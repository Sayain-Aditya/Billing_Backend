const User = require("../models/user");

// ✅ Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // create user (password plain save hoga)
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
