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

    useEffect(() => {
        const initializeWebContainer = async () => {
            try {
                const wc = await WebContainer.boot();
                setWebContainer(wc);
                console.log('WebContainer started');
                await updateWebContainer(wc, codeFiles, projectType); // Passe le type de projet
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
        if (webContainer) {
            updateWebContainer(webContainer, codeFiles, projectType); // Passe le type de projet
        }
    }, [codeFiles, webContainer, projectType]);

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
                if (i === pathParts.length - 1) {
                    currentLevel[part] = { file: { contents: file.code } };
                } else {
                    if (!currentLevel[part]) {
                        currentLevel[part] = { directory: {} };
                    }
                    currentLevel = currentLevel[part].directory;
                }
            }
        });

        return fileSystemTree;
    };
    const runPrefixCommand = async (webContainerInstance: WebContainer, command: string, args: string[]): Promise<number> => {
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

            // Installation d'Expo CLI si le projet est mobile
            if (projectType === 'mobile') {
                console.log('Setting npm prefix...');
                const setPrefixExitCode = await runPrefixCommand(webContainerInstance, 'npm', ['config', 'set', 'prefix', '~/.npm-global']);
                if (setPrefixExitCode !== 0) {
                    console.error(`Failed to set npm prefix with code ${setPrefixExitCode}`);
                    return;
                }

                console.log('Installing Expo CLI...');
                const expoInstallProcess = await webContainerInstance.spawn('npm', ['install', '-g', 'expo-cli']);
                expoInstallProcess.output.pipeTo(new WritableStream({
                    write(data) {
                        console.log(data);
                    }
                }));
                const expoInstallExitCode = await expoInstallProcess.exit;
                if (expoInstallExitCode !== 0) {
                    console.error(`Failed to install Expo CLI with code ${expoInstallExitCode}`);
                    return;
                }
                console.log('Expo CLI installed');
            }

            let devCommand = 'run dev';
            if (projectType === 'mobile') {
                devCommand = 'npx expo start --web'; // Commande pour Expo
            }
            console.log('Starting dev server with command:', devCommand);

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
            console.error("Error updating WebContainer:", error);
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