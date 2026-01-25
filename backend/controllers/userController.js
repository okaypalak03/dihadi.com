import User from '../models/User.js';

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, address, area, contactNumber, profilePhoto } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      if (name !== undefined) user.name = name;
      if (address !== undefined) user.address = address;
      if (area !== undefined) user.area = area;
      if (contactNumber !== undefined) user.contactNumber = contactNumber;
      if (profilePhoto !== undefined) user.profilePhoto = profilePhoto || null;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
