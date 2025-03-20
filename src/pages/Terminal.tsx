// import React, { useState, useEffect, useRef } from 'react';
// import { Terminal as XTerminal } from 'xterm';
// import { FitAddon } from 'xterm-addon-fit';
// import { WebContainer, FileSystemTree } from '@webcontainer/api';
// import 'xterm/css/xterm.css';

// interface CodeFile {
//     filename: string;
//     code: string;
// }

// interface TerminalProps {
//     codeFiles: CodeFile[];
//     setWebContainerURL: (url: string | null) => void;
//     projectType: 'web' | 'mobile';
//     webContainer: any;
// }

// const Terminal: React.FC<TerminalProps> = ({ codeFiles, setWebContainerURL, projectType, webContainer }) => {
//     const terminalRef = useRef<HTMLDivElement>(null);
//     const [webContainerInstance, setWebContainerInstance] = useState<WebContainer | null>(null);
//     const [internalWebContainerURL, setInternalWebContainerURL] = useState<string | null>(null);
//     const terminal = useRef<XTerminal | null>(null);
//     const [command, setCommand] = useState('');
//     const [isInputEnabled, setIsInputEnabled] = useState(false);

//     useEffect(() => {
//         let wc: WebContainer | null = null;

//         const initializeWebContainer = async () => {
//             terminal.current = new XTerminal();
//             const fitAddon = new FitAddon();
//             terminal.current.loadAddon(fitAddon);
//             terminal.current.open(terminalRef.current!);
//             fitAddon.fit();

//             const handleOutput = (data: string) => {
//                 terminal.current!.write(data);
//             };

//             try {
//                 wc = await WebContainer.boot();
//                 setWebContainerInstance(wc);

//                 handleOutput('WebContainer started...\r\n');
//                 console.log('WebContainer started');
//                 await installDependencies(wc, handleOutput); // Installer les dépendances
//                 await updateWebContainer(wc, codeFiles, projectType, handleOutput);
//             } catch (error: any) {
//                 console.error("Failed to boot WebContainer:", error);
//                 handleOutput(`Failed to boot WebContainer: ${error.message}\r\n`);
//             }
//         };

//         initializeWebContainer();

//         return () => {
//             // Cleanup
//             if (terminal.current) {
//                 terminal.current.dispose();
//             }
//             if (wc) {
//                 // wc.dispose(); // Décommentez si nécessaire
//                 console.log('WebContainer should dispose here (but is commented out)');
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (webContainerInstance) {
//             updateWebContainer(webContainerInstance, codeFiles, projectType, (data) => {
//                 console.log(data);
//                 if (terminal.current) {
//                     terminal.current.write(data);
//                 }
//             });
//         }
//     }, [codeFiles, webContainerInstance, projectType]);

//     const validateFilename = (filename: string): string => {
//         let validatedFilename = filename.replace(/[^a-zA-Z0-9/.-]/g, '_');
//         validatedFilename = validatedFilename.replace(/^_+|_+$/g, '');
//         return validatedFilename;
//     };

//     const createFileSystemTree = (files: CodeFile[]): FileSystemTree => {
//         const fileSystemTree: FileSystemTree = {};

//         files.forEach(file => {
//             const validatedFilename = validateFilename(file.filename);
//             const fullPath = validatedFilename;
//             const pathParts = fullPath.split('/');

//             let currentLevel: any = fileSystemTree;
//             for (let i = 0; i < pathParts.length; i++) {
//                 if (pathParts[i] === "") continue;
//                 const part = pathParts[i];
//                 if (i === pathParts.length - 1) {
//                     currentLevel[part] = { file: { contents: file.code } };
//                 } else {
//                     if (!currentLevel[part]) {
//                         currentLevel[part] = { directory: {} };
//                     }
//                     currentLevel = currentLevel[part].directory;
//                 }
//             }
//         });

//         return fileSystemTree;
//     };

//     const installDependencies = async (webContainerInstance: WebContainer, handleOutput: (data: string) => void) => {
//         handleOutput('Installing dependencies...\r\n');
//         const installProcess = await webContainerInstance.spawn('apt-get', ['update']);
//         await installProcess.exit;
//         handleOutput('apt-get update completed...\r\n');

//         const installProcess2 = await webContainerInstance.spawn('apt-get', ['install', '-y', 'nodejs', 'npm']);
//         installProcess2.output.pipeTo(new WritableStream({ write: handleOutput }));
//         const exitCode = await installProcess2.exit;

//         if (exitCode !== 0) {
//             console.error(`Failed to install dependencies with code ${exitCode}`);
//             handleOutput(`Failed to install dependencies with code ${exitCode}\r\n`);
//             throw new Error(`Failed to install dependencies`);
//         }
//         handleOutput('npm installed...\r\n');
//     };

//     const updateWebContainer = async (webContainerInstance: WebContainer, codeFiles: CodeFile[], projectType: 'web' | 'mobile', handleOutput: (data: string) => void) => {
//         if (!webContainerInstance) {
//             console.error("WebContainer not initialized");
//             handleOutput("WebContainer not initialized\r\n");
//             return;
//         }

//         try {
//             const fileSystemTree = createFileSystemTree(codeFiles);
//             console.log('FileSystemTree:', fileSystemTree);
//             handleOutput('FileSystemTree created\r\n');

//             await webContainerInstance.mount(fileSystemTree);
//             handleOutput('FileSystem mounted\r\n');

//             // Si le type est mobile, créez un nouveau projet Expo
//             if (projectType === 'mobile') {
//                 handleOutput('Creating new Expo app...\r\n');
//                 const createExpoAppProcess = await webContainerInstance.spawn('npx', ['create-expo-app@latest', 'StickerSmash', '--yes']);

//                 createExpoAppProcess.output.pipeTo(new WritableStream({
//                     write: (data) => {
//                         handleOutput(data);
//                         // Activer l'entrée si "Ok to proceed? (y)" est détecté
//                         if (data.includes('Ok to proceed? (y)')) {
//                             setIsInputEnabled(true);
//                         }
//                     }
//                 }));

//                 const createExitCode = await createExpoAppProcess.exit;
//                 if (createExitCode !== 0) {
//                     console.error(`Failed to create Expo app with code ${createExitCode}`);
//                     handleOutput(`Failed to create Expo app with code ${createExitCode}\r\n`);
//                     return;
//                 }
//                 handleOutput('Expo app created successfully.\r\n');
//             }

//             // Démarrer le serveur de développement
//             const devCommand = projectType === 'mobile' ? 'npm start' : 'npm run dev';
//             console.log('Starting dev server with command:', devCommand);
//             handleOutput(`Starting dev server with command: ${devCommand}\r\n`);

//             const devServerProcess = await webContainerInstance.spawn('npm', devCommand.split(' '));

//             devServerProcess.output.pipeTo(new WritableStream({
//                 write: handleOutput
//             }));

//             webContainerInstance.on('server-ready', (port, url) => {
//                 console.log(`Server ready on port ${port}, URL: ${url}`);
//                 handleOutput(`Server ready on port ${port}, URL: ${url}\r\n`);
//                 setInternalWebContainerURL(url);
//                 setWebContainerURL(url);
//             });

//         } catch (error: any) {
//             console.error("Error updating WebContainers:", error);
//             handleOutput(`Error updating WebContainers: ${error.message}\r\n`);
//         }
//     };

//     useEffect(() => {
//         if (internalWebContainerURL) {
//             setWebContainerURL(internalWebContainerURL);
//         }
//     }, [internalWebContainerURL, setWebContainerURL]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setCommand(e.target.value);
//     };

//     const sendCommand = async () => {
//         if (webContainerInstance) {
//             setIsInputEnabled(false);
//             const commandToExecute = `
//             echo "${command}" | npx create-expo-app@latest StickerSmash --yes
//             echo "${command}" | cd StickerSmash
//             `
//             ;

//             const process = await webContainerInstance.spawn('sh', ['-c', commandToExecute]);
//             process.output.pipeTo(new WritableStream({
//                 write: (data) => {
//                     console.log(data)
//                 }
//             }))
//             setCommand('');
//         } else {
//             console.warn("WebContainer not initialized.");
//         }
//     };

//     return (
//         <div>
//             <div ref={terminalRef} style={{ height: '300px', width: '100%' }} />
//             <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
//                 <input
//                     type="text"
//                     value={command}
//                     onChange={handleInputChange}
//                     placeholder="Enter command (y/n)"
//                     style={{ flex: 1, padding: '5px' }}
//                     onKeyDown={(e) => {
//                         if (e.key === 'Enter' && isInputEnabled) {
//                             sendCommand();
//                         }
//                     }}
//                     disabled={!isInputEnabled}
//                 />
//                 <button onClick={sendCommand} style={{ padding: '5px 10px' }} >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Terminal;