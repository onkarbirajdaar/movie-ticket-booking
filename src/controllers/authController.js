const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
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
module.exports = { register };