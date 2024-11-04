import Event from "../database/models/account.model";

export const getStockCount = async () => {
  const stockCount = await Event.countDocuments();


  return JSON.parse(JSON.stringify(stockCount));
};
