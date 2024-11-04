import Event from "../database/models/account.model";

export const getTotalLikes = async () => {
  const likesCount = await Event.find();

  const totalLikes = likesCount.reduce((total, event) => {
    // Assuming there is a likes field in each event
    const eventLikes = event.likes || 0;
    return total + eventLikes;
  }, 0);

  return JSON.parse(JSON.stringify(totalLikes));
};
