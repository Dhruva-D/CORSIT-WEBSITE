const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

const registerMember = async (req, res) => {
  const { name, uniqueID } = req.body;
  try {
    const exists = await Member.findOne({ uniqueID });
    if (exists) return res.status(400).json({ message: "Member already exists" });

    const newMember = new Member({ name, uniqueID });
    await newMember.save();
    res.status(201).json({ message: "Member registered. Ask them to set a password." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const setPassword = async (req, res) => {
  const { uniqueID, password } = req.body;
  try {
    const member = await Member.findOne({ uniqueID });
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.password = await bcrypt.hash(password, 10);
    await member.save();
    res.json({ message: "Password set successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginMember = async (req, res) => {
  const { uniqueID, password } = req.body;
  try {
    const member = await Member.findOne({ uniqueID });
    if (!member) return res.status(404).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, member.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: member._id, isMaster: member.isMaster }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerMember, setPassword, loginMember };
