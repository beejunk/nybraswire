import { createContext } from 'react';

import postCache, { PostCacheAPI } from './postCache';

const PostCacheContext = createContext<PostCacheAPI>(postCache);

export default PostCacheContext;
