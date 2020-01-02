import { createContext } from 'react';

import { PostCacheType } from '../types/posts';

const PostCacheContext = createContext<PostCacheType>(null);

export default PostCacheContext;
