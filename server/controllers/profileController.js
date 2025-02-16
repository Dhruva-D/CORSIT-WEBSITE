const Member = require("../models/Member");
const bcrypt = require("bcryptjs");

const updateProfile = async (req, res) => {
  const { linkedin, github, photo } = req.body;
  try {
    const member = await Member.findById(req.user.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.linkedin = linkedin || member.linkedin;
    member.github = github || member.github;
    member.photo = photo || member.photo;

    await member.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAnyProfile = async (req, res) => {
  const { uniqueID, linkedin, github, photo, masterPassword } = req.body;
  if (masterPassword !== process.env.MASTER_PASSWORD) {
    return res.status(403).json({ message: "Invalid master password" });
  }

  try {
    const member = await Member.findOne({ uniqueID });
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.linkedin = linkedin || member.linkedin;
    member.github = github || member.github;
    member.photo = photo || member.photo;

    await member.save();
    res.json({ message: "Profile updated successfully (Master Access)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const member = await Member.findById(req.user.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const valid = await bcrypt.compare(oldPassword, member.password);
    if (!valid) return res.status(401).json({ message: "Old password is incorrect" });

    member.password = await bcrypt.hash(newPassword, 10);
    await member.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateProfile, updateAnyProfile, changePassword };
