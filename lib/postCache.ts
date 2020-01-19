import { PostType, PostCacheType } from '../types/posts';

export interface PostCacheAPI {
  addPost: (post: PostType, id: string) => void;
  getCache: () => PostCacheType;
  getPost: (id: string) => PostType;
}

const store: PostCacheType = { postIds: [], postsById: {} };

const postCache: PostCacheAPI = {
  addPost(post: PostType, id: string): void {
    if (!store.postIds.includes(id)) {
      store.postIds.push(id);
      store.postsById[id] = post;
    }
  },

  getCache(): PostCacheType {
    return store;
  },

  getPost(id: string) {
    return store.postsById[id];
  },
};

export default postCache;
