import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import ini from 'highlight.js/lib/languages/ini';
import 'highlight.js/styles/solarized-dark.css';
import { createContext } from 'react';
import theme from './nybraswire';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('ini', ini);

const ThemeContext = createContext(theme);

export default ThemeContext;
