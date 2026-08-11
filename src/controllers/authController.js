const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (req, res) =>{
    try {
        const {name, email, password }=req.body;

        
        const isUser = await prisma.user.findUnique({ where: { email } });
        if (isUser) {
            return res.status(400).json({ error: "Email already registered" });
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
            data: { name, email, passwordHash },
            });

            res.status(201).json({ message: "User created", id: newUser.id });
       
        
        
    } catch (error) {
        console.error(error); res.status(500).json({ error: "Registration failed" });
        
    }

}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 2: look up the user — this was missing every time
    const user = await prisma.user.findUnique({ where: { email } });

    // Step 3: user not found — generic error, per your own answer above
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Step 4: compare submitted password against the STORED hash (user.passwordHash, not a bare variable)
    const isValid = await bcrypt.compare(password, user.passwordHash);

    // Step 5: wrong password — SAME generic error as step 3, not a different one
    if (!isValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Step 6: success — sign token using the real user object
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { register, login };