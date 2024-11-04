import Event from "../database/models/account.model";

export const getSalesCount = async () => {
  const salesCount = await Event.countDocuments();

  return JSON.parse(JSON.stringify(salesCount));
};
