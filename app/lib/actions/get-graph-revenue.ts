import Event from "../database/models/account.model";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphDownloads = async (): Promise<GraphData[]> => {
  const downloads = await Event.find();

  const monthlyDownloads: { [key: number]: number } = {};

  // Grouping the downloads by month
  for (const download of downloads) {
    const month = download.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
    monthlyDownloads[month] = (monthlyDownloads[month] || 0) + 1;
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];

  // Filling in the download data
  for (const month in monthlyDownloads) {
    graphData[parseInt(month)].total = monthlyDownloads[parseInt(month)];
  }

  return JSON.parse(JSON.stringify(graphData));
};
