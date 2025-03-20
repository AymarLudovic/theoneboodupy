import React, { useState, useEffect } from 'react';
import { WebContainer, FileSystemTree } from '@webcontainer/api';

interface CodeFile {
    filename: string;
    code: string;
}

interface WebContainerComponentProps {
    codeFiles: CodeFile[];
    setWebContainerURL: (url: string | null) => void;
    projectType: 'web' | 'mobile'; // Ajout du type de projet
}

const WebContainerComponent: React.FC<WebContainerComponentProps> = ({ codeFiles, setWebContainerURL, projectType }) => {
    const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
    const [internalWebContainerURL, setInternalWebContainerURL] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false); // Nouvel état

    useEffect(() => {
        const initializeWebContainer = async () => {
            try {
                const wc = await WebContainer.boot();
                setWebContainer(wc);
                console.log('WebContainer started');
                setInitialized(true); // Marquer comme initialisé
            } catch (error) {
                console.error("Failed to boot WebContainer:", error);
            }
        };

        initializeWebContainer();

        return () => {
            if (webContainer) {
                // webContainer.dispose();
                console.log('WebContainer should dispose here (but is commented out)');
            }
        };
    }, []);

    useEffect(() => {
        if (webContainer && initialized) { // Vérifier webContainer et initialized
            console.log('CodeFiles:', codeFiles); // Vérifier le contenu de codeFiles
            const packageJsonFile = codeFiles.find(file => file.filename === 'package.json');
            if (packageJsonFile) {
                console.log('package.json found:', packageJsonFile);
            } else {
                console.warn('package.json NOT found in codeFiles');
            }
            updateWebContainer(webContainer, codeFiles, projectType); // Passe le type de projet
        }
    }, [codeFiles, webContainer, projectType, initialized]);

    const validateFilename = (filename: string): string => {
        let validatedFilename = filename.replace(/[^a-zA-Z0-9/.-]/g, '_');
        validatedFilename = validatedFilename.replace(/^_+|_+$/g, '');
        return validatedFilename;
    };

    const createFileSystemTree = (files: CodeFile[]): FileSystemTree => {
        const fileSystemTree: FileSystemTree = {};
    
        files.forEach(file => {
            const validatedFilename = validateFilename(file.filename);
            const fullPath = validatedFilename;
            const pathParts = fullPath.split('/');
    
            let currentLevel: any = fileSystemTree;
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i] === "") continue;
                const part = pathParts[i];
    
                // Correction importante : Remplace "_tabs_" par "(tabs)"
                const correctedPart = part === "_tabs_" ? "(tabs)" : part;
    
                if (i === pathParts.length - 1) {
                    currentLevel[correctedPart] = { file: { contents: file.code } };
                } else {
                    if (!currentLevel[correctedPart]) {
                        currentLevel[correctedPart] = { directory: {} };
                    }
                    currentLevel = currentLevel[correctedPart].directory;
                }
            }
        });
    
        return fileSystemTree;
    };

    const runCommand = async (webContainerInstance: WebContainer, command: string, args: string[]): Promise<number> => {
        const process = await webContainerInstance.spawn(command, args);
        process.output.pipeTo(new WritableStream({
            write(data) {
                console.log(`${command} ${args.join(' ')}: ${data}`);
            }
        }));
        return process.exit;
    };

    const updateWebContainer = async (webContainerInstance: WebContainer, codeFiles: CodeFile[], projectType: 'web' | 'mobile') => {
        if (!webContainerInstance) {
            console.error("WebContainer not initialized");
            return;
        }

        try {
            const fileSystemTree = createFileSystemTree(codeFiles);
            console.log('FileSystemTree:', fileSystemTree);

            await webContainerInstance.mount(fileSystemTree);

            // Ensure Node.js and npm are available
            console.log('Checking Node.js and npm...');
            const nodeCheckExitCode = await runCommand(webContainerInstance, 'node', ['-v']);
            if (nodeCheckExitCode !== 0) {
                console.error('Node.js not found. Installation may be required.');
                return;
            }

            const npmCheckExitCode = await runCommand(webContainerInstance, 'npm', ['-v']);
            if (npmCheckExitCode !== 0) {
                console.error('npm not found. Installation may be required.');
                return;
            }
            console.log('Node.js and npm are available.');

            if (fileSystemTree['package.json'] && 'file' in fileSystemTree['package.json']) {
                console.log('Installing dependencies...');
                const installProcess = await webContainerInstance.spawn('npm', ['install']);
                installProcess.output.pipeTo(new WritableStream({
                    write(data) {
                        console.log(data);
                    }
                }));
                const installExitCode = await installProcess.exit;
                if (installExitCode !== 0) {
                    console.error(`npm install failed with code ${installExitCode}`);
                    return;
                }
                console.log('Dependencies installed');
            } else {
                console.warn('No package.json found, skipping dependency installation.');
                return;  // Important: Arrête si pas de package.json
            }

            let devCommand = 'run dev';
           
            const devServerProcess = await webContainerInstance.spawn('npm', devCommand.split(' '));
            devServerProcess.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));

            webContainerInstance.on('server-ready', (port, url) => {
                console.log(`Server ready on port ${port}, URL: ${url}`);
                setInternalWebContainerURL(url);
            });

        } catch (error: any) {
            console.error("Error updating WebContainers:", error);
            console.error("Detailed error:", error.message, error.stack);
        }
    };

    useEffect(() => {
        if (internalWebContainerURL) {
            setWebContainerURL(internalWebContainerURL);
        }
    }, [internalWebContainerURL, setWebContainerURL]);

    return null;
};

export default WebContainerComponent;