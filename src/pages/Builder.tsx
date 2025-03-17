import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import WebContainerComponent from './WebContainerComponent';
import { Paperclip, Send, Mic, Stars } from "lucide-react"

interface Message {
    text: string;
    isUser: boolean;
    isCode?: boolean;
}

interface CodeFile {
    filename: string;
    code: string;
}

const Builder = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userPrompt, setUserPrompt] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
    const [webContainerURL, setWebContainerURL] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [projectType, setProjectType] = useState<'web' | 'mobile'>('web'); // État pour le type de projet

    const getInitialPrompt = (projectType: 'web' | 'mobile') => {
        if (projectType === 'web') {
            return `Tu es un expert en création de sites web fullstack, avec une forte expertise en design, similaire aux sites de Framer. Tu utilises Vite.js avec React et TypeScript. Tu es capable de proposer des structures de projet complètes et bien organisées, et de générer le code source de tous les fichiers du projet.

Lorsque l'utilisateur te demande de l'aide pour un site web, tu commences par proposer une structure de projet détaillée, puis tu génères le code source pour chaque fichier que tu as defini dans la structure du projet que tu as creer meme si il s'agit d'un fichier de styles comme par exemple App.css ou tout autres. Sois très précis et complet. Genere un fichier package.json avec les dépendances qui seront utilisées pour le site.

**Important :** Pour assurer le bon fonctionnement du projet Vite, assure-toi que la structure du projet inclut les fichiers suivants à la racine du projet (au même niveau que le fichier \`package.json\`) :

*   \`index.html\` (point d'entrée principal de l'application Vite, essentiel pour le rendu initial).
*   \`tsconfig.json\` (configuration TypeScript de base pour le projet).
*   \`tsconfig.node.json\` (configuration TypeScript additionnelle pour l'environnement Node, souvent nécessaire pour les outils de build).
*   \`eslint.config.js\` (configuration ESLint pour l'analyse statique du code et le respect des normes de codage).
*   \`.gitignore\` (fichier de configuration Git pour exclure les fichiers non suivis).
*   \`README.md\` (fichier de documentation du projet).

Ces fichiers sont cruciaux pour la configuration et le bon fonctionnement du projet. Tu peux ensuite ajouter d'autres fichiers et dossiers selon les besoins du projet.`;
        } else { // projectType === 'mobile'
            return `Tu es un expert en création d'applications mobiles avec React Native et Expo. Tu es capable de proposer des structures de projet complètes et bien organisées, et de générer le code source de tous les fichiers du projet.

Lorsque l'utilisateur te demande de l'aide pour une application mobile, tu commences par proposer une structure de projet détaillée, puis tu génères le code source pour chaque fichier que tu as defini dans la structure du projet que tu as creer meme si il s'agit d'un fichier de styles ou de composants. Sois très précis et complet. Genere un fichier package.json avec les dépendances qui seront utilisées pour l'application, en incluant les dépendances Expo nécessaires.

**Important :** Pour assurer le bon fonctionnement du projet React Native Expo, assure-toi de générer le code source complet et valide pour *tous* les fichiers suivants à la racine du projet (au même niveau que le fichier \`package.json\`).  Il est **crucial** de ne pas omettre ces fichiers :

*   \`App.js\` ou \`App.tsx\` : C'est le point d'entrée principal de l'application Expo.  Il doit contenir le code React Native initial.
*   \`app.json\` : C'est le fichier de configuration Expo.  Il doit contenir des informations essentielles sur l'application, comme son nom, son identifiant, ses icônes, etc.  **Génère un fichier 'app.json' complet et valide.**
*   \`.gitignore\` : Ce fichier doit contenir les règles pour exclure les fichiers non suivis par Git (par exemple, 'node_modules').
*   \`metro.config.js\` (ou \`metro.config.cjs\`) : Ce fichier configure Metro, le bundler utilisé par React Native.  Si tu utilises des configurations personnalisées (par exemple, pour gérer les assets), il est important de le générer.  Sinon, un fichier de configuration par défaut suffit.
*   \`README.md\` : (Optionnel, mais recommandé) Un fichier de documentation de base pour le projet.

**Le fichier \`package.json\` est également essentiel.** Assure-toi qu'il contient toutes les dépendances nécessaires pour React Native et Expo, ainsi que les scripts pour démarrer l'application (par exemple, \`"start": "expo start"\`).

Ces fichiers sont absolument cruciaux pour la configuration et le bon fonctionnement du projet. Assure-toi de les inclure tous dans ta réponse.`;
        }
    };

    const fileExtractionPrompt = `Pour faciliter l'extraction automatique du code, utilise le format suivant pour chaque fichier :

\`\`\`
Nom du fichier: nom_du_fichier.extension
<Extracted_code>
// Code source du fichier
</Extracted_code>
\`\`\`

Par exemple :

\`\`\`
Nom du fichier: src/components/Button.tsx
<Extracted_code>
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
</Extracted_code>
\`\`\``;
    const projectStructurePrompt = `Présente la structure du projet sous forme de liste Markdown.
Si la question n'est pas directement liée au développement web ou à la génération de code, réponds de manière conversationnelle sans mentionner ton expertise en développement web.`;

    const sendMessage = async () => {
        if (!userPrompt.trim() || isSending) return;

        setIsSending(true);
        setMessages(prevMessages => [...prevMessages, { text: userPrompt, isUser: true }]);
        const initialPrompt = getInitialPrompt(projectType); // Obtient le prompt basé sur le type de projet
        const input = initialPrompt + "\n\n" + fileExtractionPrompt + "\n\n" + projectStructurePrompt + "\n\n" + userPrompt;
        setUserPrompt('');

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                console.error("GEMINI_API_KEY is missing in environment variables.");
                setMessages(prevMessages => [...prevMessages, { text: "Error: API Key is missing in environment variables.", isUser: false }]);
                setIsSending(false);
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);

            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash", // ou gemini-1.5-pro si disponible et plus puissant
            });

            const result = await model.generateContent(input);
            let responseText = result.response.text();

            // Extraction des fichiers de code
            const extractedFiles = extractCodeFiles(responseText);
            setCodeFiles(extractedFiles);

            // Détecte si la réponse contient des blocs de code Markdown
            const isCodeResponse = responseText.includes("<Extracted_code>");

            setMessages(prevMessages => [...prevMessages, { text: responseText, isUser: false, isCode: isCodeResponse }]);



        } catch (error: any) {
            console.error("Error calling Gemini API:", error);
            setMessages(prevMessages => [...prevMessages, { text: `Error: ${error}`, isUser: false }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPrompt(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const extractCodeFiles = (text: string): CodeFile[] => {
        const files: CodeFile[] = [];
        const regex = /Nom du fichier: ([a-zA-Z0-9\/.-]+\.[a-z]+)\n<Extracted_code>\n([\s\S]*?)<\/Extracted_code>/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const filename = match[1];
            const code = match[2].trim();
            files.push({ filename, code });
        }

        return files;
    };

    const CodeFileList = ({ codeFiles }: { codeFiles: CodeFile[] }) => {
        return (
            <div>
                {codeFiles.map((file, index) => (
                    <div key={index}>
                        <p><strong>{file.filename}</strong></p>
                        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
                            {file.code}
                        </pre>
                        <button onClick={() => downloadCode(file.filename, file.code)}>
                            Download
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const downloadCode = (filename: string, code: string) => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h1>Chat</h1>
             <div>
                <label>
                    Type de projet:
                    <select value={projectType} onChange={(e) => setProjectType(e.target.value as 'web' | 'mobile')}>
                        <option value="web">Web</option>
                        <option value="mobile">Mobile (React Native Expo)</option>
                    </select>
                </label>
            </div>
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.isUser ? 'right' : 'left', marginBottom: '10px' }}>
                        <strong>{message.isUser ? 'You:' : 'Gemini:'}</strong>
                        {message.isCode ? (
                            <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>{message.text}</pre>
                        ) : (
                            <p>{message.text}</p>
                        )}
                    </div>
                ))}
            </div>
            <div>
            <div className="w-[350px] h-[120px] mt-22 relative border border-[#EEE] rounded-[25px]">
                        <div className='p-2'>
                        <input
                    type="text"
                    placeholder="Enter your message"
                    value={userPrompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                    className='h-full w-full'
                />
                        </div>
                        <div className=" bottom-1 p-2 w-full absolute flex items-center justify-between">
                           <div className="items-center gap-1 flex">
                           <div className="px-1 py-1 rounded-[12px]">
                           <Paperclip size={22}></Paperclip>
                           </div>
                           <div className="px-1 py-1 rounded-[12px]">
                           <Stars size={22}></Stars>
                           </div>
                           <div className="px-1 py-1 rounded-[12px]">
                           <Mic size={22}></Mic>
                           </div>
                           </div>
                           <button onClick={sendMessage} disabled={isSending}>
                                {isSending &&(
                                    <div className="px-2 py-2 rounded-[12px] bg-[#fafafa]">
                                    <Send size={22}></Send>
                                    </div>
                                )}
                                {!isSending && (
                                    <div className="px-2 py-2 rounded-[12px] bg-[#000] ">
                                    <Send size={22}></Send>
                                    </div>
                                )}
                           </button>
                           
                        </div>
                    </div>
               
                
            </div>
            <h2>Extracted Files</h2>
            <CodeFileList codeFiles={codeFiles} />

            {/* Utilisation du composant WebContainerComponent */}
            <WebContainerComponent
                codeFiles={codeFiles}
                setWebContainerURL={setWebContainerURL}
                projectType={projectType} // Passe le type de projet au composant WebContainer
            />

            <h2>WebContainer Preview</h2>
            {webContainerURL ? (
                <>
                    <p>WebContainer URL: {webContainerURL}</p> {/* Afficher l'URL */}
                    <iframe
                        ref={iframeRef}
                        src={webContainerURL}  // Utiliser le chemin de proxy
                        width="800"
                        height="600"
                        title="WebContainer Preview"
                        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation allow-same-origin"
                        allow="cross-origin-isolated"
                    />
                </>
            ) : (
                <p>WebContainer loading.......</p>
            )}
        </div>
    );
};

export default Builder;