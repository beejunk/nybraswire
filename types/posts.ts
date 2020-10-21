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

export type PostType = {
  title: string;
  body: string;
  createdOn: number;
  updatedOn: number;
  postedOn: number;
  published: boolean;
};

export type PostCacheType = {
  postIds: string[];
  postsById: { [id: string]: PostType };
}

export interface PostCacheAPI {
  currentPageIds: string[];
  postIds: string[];
  postsById: { [id: string]: PostType };
  addPostsToCache(): void;
  getNextPage(): void;
  getPrevPage(): void;
}
