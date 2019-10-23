import { createContext } from 'react';

import { PostCacheAPI } from '../types/posts';

const PostCacheContext = createContext<PostCacheAPI>(null);

export default PostCacheContext;
