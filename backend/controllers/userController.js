exports.getMyProfile = async (req, res) => {
    try {
      return res.status(200).json({ user: req.user });
    } catch (error) {
      console.error('Get Profile Error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  