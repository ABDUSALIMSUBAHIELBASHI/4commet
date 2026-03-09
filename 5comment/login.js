// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('Login attempt with:', req.body);
    
    const { username, password } = req.body;
    const loginInput = username; // This could be username or email

    if (!loginInput || !password) {
      return res.status(400).json({ message: 'Please provide username/email and password' });
    }

    // Check if user exists by username OR email
    const user = await User.findOne({
      $or: [
        { username: loginInput },
        { email: loginInput.toLowerCase() }
      ]
    }).select('+password');

    if (!user) {
      console.log('User not found for:', loginInput);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.log('Password mismatch for user:', user.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user.username);

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};