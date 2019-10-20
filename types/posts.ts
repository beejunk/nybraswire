export interface AlertState {
  color: string;
  message: string;
  show: boolean;
}

export interface FormState {
  title: string;
  body: string;
  postedOnDate: string;
  postedOnTime: string;
}

export interface PostType {
  title: string;
  body: string;
  createdOn: number;
  updatedOn: number;
  postedOn: number;
  published: boolean;
}

export interface PostCacheType {
  postIds: string[];
  postsById: { [id: string]: PostType };
}
