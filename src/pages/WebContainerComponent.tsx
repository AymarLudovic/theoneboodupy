import React, { useState, useEffect, useRef } from 'react'; // Ajout de useRef
import { WebContainer, FileSystemTree } from '@webcontainer/api';
import { Client, Databases, ID, Query } from 'appwrite';
import { useParams } from 'react-router-dom';

interface Message {
    text: string;
    isUser: boolean;
    isCode?: boolean;
    $id?: string; // ID du message dans Appwrite
}

interface CodeFile {
    filename: string;
    code: string;
}

interface WebContainerComponentProps {
    lastAIMessageWithCode: Message | null;
    setWebContainerURL: (url: string | null) => void;
    projectType: 'web' | 'mobile';
    extractCodeFiles: (text: string) => CodeFile[];
    onWebContainerStart: () => void;
    onWebContainerStop: () => void;
}

// Initialiser Appwrite (assurez-vous que ces valeurs sont correctes et dans un .env)
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679d739b000950dfb1e0');

const databases = new Databases(client);

const WebContainerComponent: React.FC<WebContainerComponentProps> = ({
    lastAIMessageWithCode,
    setWebContainerURL,
    projectType,
    extractCodeFiles,
    onWebContainerStart,
    onWebContainerStop,
}) => {
    const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
    const [internalWebContainerURL, setInternalWebContainerURL] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [existingCodeFiles, setExistingCodeFiles] = useState<CodeFile[]>([]); // Nouveau state pour les fichiers existants
    const lastAIMessageWithCodeRef = useRef<Message | null>(null); //ref pour stocker la valeur précédente de lastAIMessageWithCode

    const databaseId = 'Boodupy-database-2025';
    const collectionId = 'CodeFiles-200900';
    const { id: appId } = useParams<{ id: string }>();

    useEffect(() => {
        const initializeWebContainer = async () => {
            onWebContainerStart(); // Appeler le callback au début
            try {
                const wc = await WebContainer.boot();
                setWebContainer(wc);
                console.log('WebContainer started');
                setInitialized(true); // Marquer comme initialisé
            } catch (error) {
                console.error("Failed to boot WebContainer:", error);
            } finally {
                onWebContainerStop(); // Appeler le callback à la fin
            }
        };

        initializeWebContainer();

        return () => {
            if (webContainer) {
                //webContainer.dispose();
                console.log('WebContainer should dispose here (but is commented out)');
            }
        };
    }, []);

    // Fonction pour comparer deux tableaux de CodeFile
    const areFilesDifferent = (newFiles: CodeFile[], oldFiles: CodeFile[]): boolean => {
        if (newFiles.length !== oldFiles.length) {
            return true; // Nombre de fichiers différent
        }

        for (let i = 0; i < newFiles.length; i++) {
            if (newFiles[i].filename !== oldFiles[i].filename || newFiles[i].code !== oldFiles[i].code) {
                return true; // Fichier différent trouvé
            }
        }

        return false; // Tous les fichiers sont identiques
    };

    useEffect(() => {
        const fetchCodeFilesFromAppwrite = async (): Promise<CodeFile[] | undefined> => {
            if (!appId) {
                console.error("ID de l'application non trouvé dans l'URL.");
                return undefined; // Retourner undefined si pas d'appId
            }

            try {
                const response = await databases.listDocuments(databaseId, collectionId, [
                    Query.equal('appId', appId),
                ]);

                const codeFiles: CodeFile[] = response.documents.map(doc => ({
                    filename: doc.filename,
                    code: doc.code,
                }));
                return codeFiles;
            } catch (error) {
                console.error("Erreur lors de la récupération des fichiers de code depuis Appwrite :", error);
                return undefined; // Retourner undefined en cas d'erreur
            }
        };

        const initializeExistingCode = async () => {
            if (webContainer && initialized && appId) {
                const codeFiles = await fetchCodeFilesFromAppwrite(); // Récupérer les fichiers depuis Appwrite

                if (codeFiles) { // Vérifier si codeFiles n'est pas undefined
                    console.log("Fichiers de code existants récupérés depuis Appwrite :", codeFiles);
                    await updateWebContainer(webContainer, codeFiles, projectType);
                    setExistingCodeFiles(codeFiles); // Mettre à jour l'état avec les fichiers récupérés
                } else {
                    console.log("Aucun fichier de code existant trouvé dans Appwrite.");
                }
            }
        };

        initializeExistingCode();

    }, [webContainer, initialized, appId, projectType]);

    useEffect(() => {
        if (webContainer && initialized && lastAIMessageWithCode && lastAIMessageWithCode.isCode && appId) {

            if (lastAIMessageWithCodeRef.current?.$id === lastAIMessageWithCode.$id) {
                console.log("Message has already been processed. Skipping.");
                return; // Skip processing if the message is the same
            }

            const codeFiles = extractCodeFiles(lastAIMessageWithCode.text);
            console.log('CodeFiles:', codeFiles);

            // Comparer les nouveaux fichiers avec les anciens
            const filesChanged = areFilesDifferent(codeFiles, existingCodeFiles);

            if (!filesChanged) {
                console.log("No file changes detected. Skipping WebContainer update.");
                return; // Skip the update if no files have changed
            }

            const packageJsonFile = codeFiles.find(file => file.filename === 'package.json');
            if (packageJsonFile) {
                console.log('package.json found:', packageJsonFile);
            } else {
                console.warn('package.json NOT found in codeFiles');
            }

            updateWebContainer(webContainer, codeFiles, projectType);
            setExistingCodeFiles(codeFiles); // Mettre à jour les fichiers existants
            lastAIMessageWithCodeRef.current = lastAIMessageWithCode;

            // Enregistrer les fichiers dans Appwrite
            saveCodeFilesToAppwrite(codeFiles);

        } else {
            console.log("No code available or WebContainer not ready.");
        }
    }, [lastAIMessageWithCode, webContainer, projectType, initialized, extractCodeFiles, existingCodeFiles, appId]);

    const saveCodeFilesToAppwrite = async (codeFiles: CodeFile[]) => {
        if (!appId) {
            console.error("ID de l'application non trouvé dans l'URL.");
            return;
        }

        try {
            // Supprimer d'abord tous les anciens fichiers de code
            const response = await databases.listDocuments(databaseId, collectionId, [
                Query.equal('appId', appId)
            ]);
            await Promise.all(response.documents.map(doc =>
                databases.deleteDocument(databaseId, collectionId, doc.$id)
            ));

            // Ensuite, créer les nouveaux fichiers de code
            await Promise.all(codeFiles.map(file =>
                databases.createDocument(databaseId, collectionId, ID.unique(), {
                    appId: appId,
                    filename: file.filename,
                    code: file.code,
                })
            ));

            console.log("Fichiers de code enregistrés avec succès dans Appwrite.");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des fichiers de code dans Appwrite :", error);
        }
    };

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
        onWebContainerStart();
        if (!webContainerInstance) {
            console.error("WebContainer not initialized");
            onWebContainerStop();
            return;
        }

        console.log("Project Type:", projectType);

        try {
            const fileSystemTree = createFileSystemTree(codeFiles);
            console.log('FileSystemTree:', fileSystemTree);

            await webContainerInstance.mount(fileSystemTree);

            // Ensure Node.js and npm are available
            console.log('Checking Node.js and npm...');
            const nodeCheckExitCode = await runCommand(webContainerInstance, 'node', ['-v']);
            if (nodeCheckExitCode !== 0) {
                console.error('Node.js not found. Installation may be required.');
                onWebContainerStop();
                return;
            }

            const npmCheckExitCode = await runCommand(webContainerInstance, 'npm', ['-v']);
            if (npmCheckExitCode !== 0) {
                console.error('npm not found. Installation may be required.');
                onWebContainerStop();
                return;
            }
            console.log('Node.js and npm are available.');

            if (fileSystemTree['package.json'] && 'file' in fileSystemTree['package.json']) {
                console.log('Installing dependencies...');
                const installProcess = await webContainerInstance.spawn('pnpm', ['install']);
                installProcess.output.pipeTo(new WritableStream({
                    write(data) {
                        console.log(data);
                    }
                }));
                const installExitCode = await installProcess.exit;
                if (installExitCode !== 0) {
                    console.error(`npm install failed with code ${installExitCode}`);
                    onWebContainerStop();
                    return;
                }
                console.log('Dependencies installed');
            } else {
                console.warn('No package.json found, skipping dependency installation.');
                onWebContainerStop();
                return;  // Important: Arrête si pas de package.json
            }

            let devCommand = 'run dev';

            const devServerProcess = await webContainerInstance.spawn('pnpm', devCommand.split(' '));
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
        } finally {
            onWebContainerStop();
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