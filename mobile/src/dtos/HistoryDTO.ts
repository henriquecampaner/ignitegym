export type HistoryDTO = {
  id: string;
  name: string;
  group: string;
  hour: string;
  user_id: string;
  created_at: string;
};

export type HistoryByDayDTO = {
  title: string;
  data: HistoryDTO[];
};
