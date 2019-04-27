import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/solarized-dark.css';
import { createContext } from 'react';
import theme from './nybraswire';

hljs.registerLanguage('javascript', javascript);

const ThemeContext = createContext(theme);

export default ThemeContext;
