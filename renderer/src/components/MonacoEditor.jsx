// renderer/src/components/MonacoEditor.jsx
import { onMount, onCleanup } from 'solid-js';
import * as monaco from 'monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { CloseAction, ErrorAction } from "vscode-languageclient";
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';
import 'vscode/localExtensionHost';
import { initialize } from 'vscode/services';
import editorWorker from 'monaco-editor'


const MonacoEditor = (props) => {
  let container;

  onMount(async() => {

    await initialize();

    const worker = window.MonacoEnvironment = {
      getWorker(_workerId, _label) {
        return new editorWorker();
      }
    }

    const editor = monaco.editor.create(container, {
      value: props.value || '',
      language: props.language || 'cpp',
      theme: props.theme || 'vs-dark',
      automaticLayout: true,
      ...props.options,
    });
    
    const wsSocket = new WebSocket('ws://localhost:5007');
    wsSocket.onopen = () => {
        console.log("Opening Websocket")
        const socket = toSocket(wsSocket);
        const reader = new WebSocketMessageReader(socket);
        const writer = new WebSocketMessageWriter(socket);
        

        const languageClient = new MonacoLanguageClient({
            name: "Arduino Language Client",
            clientOptions: {
            documentSelector: [{ language: 'cpp' }],
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.Restart
            }
            },
            connectionProvider: {
                get: () => Promise.resolve({reader, writer})
            }
        }); 


        languageClient.start();
    };

    onCleanup(() => {
      editor.dispose();
    });
  });

  return (
    <div
      ref={container}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    ></div>
  );
};

export default MonacoEditor;
