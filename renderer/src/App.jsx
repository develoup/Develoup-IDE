// renderer/src/App.jsx
import { createEffect, createSignal } from 'solid-js';
import MonacoEditor from './components/MonacoEditor';

const App = () => {
  const [code, setCode] = createSignal('void main() {}\n\nint davidlol = 22');

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
     { <MonacoEditor
        value={code()}
        language="cpp"
        theme="vs-dark"
        onChange={(value) => setCode(value)}
      />}
    </div>
  );
};

export default App;
