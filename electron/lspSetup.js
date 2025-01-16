import path, { dirname } from 'path';
import { spawn } from 'child_process';
import WebSocket from 'ws';
import { fileURLToPath } from 'url';
import { StreamMessageReader, StreamMessageWriter, createMessageConnection } from 'vscode-jsonrpc';
import { WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';

const setupLSP = () => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const binPath = path.join(__dirname, '../resources/bin') // Electron packs resources here in production builds

    console.log(binPath)

    // Paths to binaries
    const arduinoLanguageServerPath = path.join(binPath, 'arduino-language-server');
    const arduinoCliPath = path.join(binPath, 'arduino-cli');
    const clangdPath = path.join(binPath, 'clangd');

    const cliConfigPath = path.join(__dirname, '../resources/config/arduino-cli.yaml')

    // Example arguments:
    // --cli points to arduino-cli
    // --clangd points to clangd
    // --fqbn sets the target board
    // --verify and --source-dirs tell ALS how to analyze the project
    const args = [
        `--cli=${arduinoCliPath}`,
        `--cli-config=${cliConfigPath}`,
        `--clangd=${clangdPath}`,
        '--fqbn=esp32:esp32:esp32',
    ];

    const arduinoLsProcess = spawn(arduinoLanguageServerPath, args);

    arduinoLsProcess.stderr.on('data', data => {
        console.error('Arduino LS stderr: ', data.toString());
    });
    arduinoLsProcess.on('exit', code => {
        console.log(`Arduino Language Server exited with code ${code}`);
    });

    // Now we need to set up a communication channel (LSP over JSON-RPC) between the renderer and this process.
    // The language server communicates over stdin/stdout with the LSP protocol.
    // We can proxy this via a WebSocket.
    const wss = new WebSocket.Server({ port: 5007 });

    wss.on('connection', (socket) => {

        console.log("Server: WebSocket connection established!")

        // Create JSON-RPC connection for the WebSocket
        const reader = new WebSocketMessageReader(socket);
        const writer = new WebSocketMessageWriter(socket);
        const clientConnection = createMessageConnection(reader, writer);
  
        // Create JSON-RPC connection for the language server process
        const serverReader = new StreamMessageReader(arduinoLsProcess.stdout);
        const serverWriter = new StreamMessageWriter(arduinoLsProcess.stdin);
        const serverConnection = createMessageConnection(serverReader, serverWriter);

        // Forward messages between client and server
        clientConnection.onRequest = serverConnection.sendRequest.bind(serverConnection);
        clientConnection.onNotification = serverConnection.sendNotification.bind(serverConnection);
        serverConnection.onRequest = clientConnection.sendRequest.bind(clientConnection);
        serverConnection.onNotification = clientConnection.sendNotification.bind(clientConnection);
 
        clientConnection.listen();
        serverConnection.listen();

            // // We'll read from Arduino LS stdout and send it to the client
            // console.log("Server: Connecting WebSocket")
            // arduinoLsProcess.stdout.on('data', data => {
            // // data is LSP JSON-RPC messages separated by newlines
            //     const lines = data.toString().split('\n').filter(l => l.trim());
            //     for (const line of lines) {
            //         console.log(line)
            //         socket.send(line);
            //     }
    });

        // From client (renderer) to Arduino LS stdin
    socket.on('message', message => {
        console.log("Server: Message from Client: " + message)
        arduinoLsProcess.stdin.write(message + '\n');
    });
};

export default setupLSP;