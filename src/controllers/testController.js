const prisma = require('../config/prisma');

const testDb = async (requestAnimationFrame, res) => {
    try {
        const city = await prisma.city.create({
            data: { name: 'Mumbai'},
        });
        res.json({message: "Database write successful", city});
    } 
    catch (error)
    {
        console.error(error);
        res.status(500).json({error: 'Database write failed'});
    }

};

module.exports = { testDb };