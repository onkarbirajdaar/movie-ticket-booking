const prisma = require('../config/prisma');

const generateSeats = async (req, res) =>
{
    try {
        const { screenId } = req.params;
        const { seatsPerRow = 10, section = 'GENERAL', seatType= 'STANDARD' }= req.body;

        const screen = await prisma.screen.findUnique({where:{id: screenId}});
        if(!screen) return res.status(404).json({error: 'Screen not found'});

        const totalRows = Math.ceil(screen.totalSeats / seatsPerRow );
        const seatsToCreate = [];

        for (let row =0; row< totalRows; row++) {
            const rowLabel = String.fromCharCode(65+ row);
            for(let seatNum =1; seatNum<= seatsPerRow; seatNum++){
                if(seatsToCreate.length >= screen.totalSeats) break;
                seatsToCreate.push({
                    screenId,
                    rowLabel,
                    seatNumber: seatNum,
                    section,
                    seatType,

                });
            }
        }
        
        const created = await prisma.seat.createMany({data: seatsToCreate});
        res.status(201).json({message: `${created.count} seats created`});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to generate seats'});
        
    }

};

const getSeatsByScreen = async (req, res ) =>{
    try {
        const seats = await prisma.seat.findMany({
            where: {screenId: req.params.ScreenId},
            orderBy:[{rowLabel: 'asc'}, {seatNumber: 'asc'}], 
        });
        res.json(seats);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch seats'});
        
    }
};

module.exports = {generateSeats, getSeatsByScreen};