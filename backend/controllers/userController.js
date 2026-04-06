const users = []; // This would normally come from a database

// Get all users
const getAllUsers = (req, res) => {
    res.status(200).json(users);
};

// Get user by ID
const getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
};

// Update user
const updateUser = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    Object.assign(user, req.body);
    res.status(200).json(user);
};

// Delete user
const deleteUser = (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found');
    users.splice(userIndex, 1);
    res.status(204).send();
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };