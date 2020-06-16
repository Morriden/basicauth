const Auction = require('../models/auction');

const auctionClosed = async() => {
  const now = new Date();
  const hourAgo = new Date(now);
  hourAgo.setHours(hourAgo.getHours() - 1);
  const closedAuctions = await Auction.find({
    $gt:{ Date: hourAgo },
    $lte:{ Date: now }
  });
}; 
