import prisma from '../config/prisma.js';

export const getManagerStats = async (req, res) => {
  try {
    const activeCars = await prisma.parkingSession.count({
      where: { status: 'parked' }
    });

    const retrieving = await prisma.parkingSession.count({
      where: { status: 'retrieving' }
    });
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const totalToday = await prisma.parkingSession.count({
      where: { entryTime: { gte: todayStart } }
    });
    
    const revenueResult = await prisma.parkingSession.aggregate({
      where: {
        paymentStatus: 'paid',
        entryTime: { gte: todayStart }
      },
      _sum: { amount: true }
    });

    const revenue = revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0;

    res.json({
      activeCars,
      retrieving,
      totalToday,
      revenue
    });
  } catch (err) {
    console.error('Manager stats error:', err);
    res.json({
      activeCars: 0,
      retrieving: 0,
      totalToday: 0,
      revenue: 0
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const ticketsIssuedToday = await prisma.parkingSession.count({
      where: { entryTime: { gte: todayStart } }
    });

    const collectionTodayResult = await prisma.parkingSession.aggregate({
      where: {
        paymentStatus: 'paid',
        entryTime: { gte: todayStart }
      },
      _sum: { amount: true }
    });
    const collectionToday = collectionTodayResult._sum.amount ? Number(collectionTodayResult._sum.amount) : 0;

    const totalTickets = await prisma.parkingSession.count();

    const totalCollectionResult = await prisma.parkingSession.aggregate({
      where: { paymentStatus: 'paid' },
      _sum: { amount: true }
    });
    const totalCollection = totalCollectionResult._sum.amount ? Number(totalCollectionResult._sum.amount) : 0;

    const activeParking = await prisma.parkingSession.count({
      where: { status: { in: ['parked', 'retrieving', 'pending'] } }
    });

    res.json({
      ticketsIssuedToday,
      collectionToday,
      totalTickets,
      totalCollection,
      activeParking
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.json({
      ticketsIssuedToday: 0,
      collectionToday: 0,
      totalTickets: 0,
      totalCollection: 0,
      activeParking: 0
    });
  }
};
