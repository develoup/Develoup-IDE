/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.jsx'
import 'monaco-editor/min/vs/editor/editor.main.css';

const root = document.getElementById('root')

render(() => <App />, root)
