// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import WebContainerComponent from './WebContainerComponent';
// import { Paperclip, Send, Mic, Stars,   } from "lucide-react";
// import { useParams } from 'react-router-dom';
// import { Client, Databases, ID, Query } from 'appwrite';



// interface Message {
//     text: string;
//     isUser: boolean;
//     isCode?: boolean;
//     $id?: string; // ID du message dans Appwrite
// }

// interface CodeFile {
//     filename: string;
//     code: string;
// }


// // Initialiser Appwrite (assurez-vous que ces valeurs sont correctes et dans un .env)
// const client = new Client();
// client
//     .setEndpoint('https://cloud.appwrite.io/v1')
//     .setProject('679d739b000950dfb1e0');

// const databases = new Databases(client);

// const BuilderExample = () => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [userPrompt, setUserPrompt] = useState<string>('');
//     const [isSending, setIsSending] = useState<boolean>(false);
//     const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
//     const [webContainerURL, setWebContainerURL] = useState<string | null>(null);
//     const [isIframeExtended, setIsIframeExtended] = useState<boolean>(false);
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const [projectType, setProjectType] = useState<'web' | 'mobile'>('web');
//     const { id: appId } = useParams<{ id: string }>();
//     // const [ setError] = useState<string>('');
 


   

//     //Nouvel état pour cacher le selecteur  + les suggestions
//     const [areElementsHidden, setAreElementsHidden] = useState<boolean>(() => {
//         //On recupere la valeur dans local storage
//         const storedValue = localStorage.getItem(`elementsHidden-${appId}`);
//         //Si elle existe on retourne sa valeur booleenne, sinon on retourne false
//         return storedValue ? JSON.parse(storedValue) : false;
//     });

//     useEffect(() => {
//         localStorage.setItem(`elementsHidden-${appId}`, JSON.stringify(areElementsHidden));
//     }, [areElementsHidden,appId]);
    

//     useEffect(() => {
//         if (messages.length > 0) {
//             setAreElementsHidden(true);
//         }
//     }, [messages]);

//     const toggleIframeSize = () => {
//         setIsIframeExtended(!isIframeExtended);
//     };

//     const databaseId = 'Boodupy-database-2025';
//     const collectionId = 'discutes-200900';

//     const fetchMessages = async () => {
//         if (!appId) {
//             console.error("ID de l'application non trouvé dans l'URL.");
//             console.log("ID de l'application non trouvé.");
//             return;
//         }

//         try {
//             const response = await databases.listDocuments(
//                 databaseId,
//                 collectionId,
//                 [
//                     Query.equal('appId', appId),
//                     Query.orderAsc('createdAt'),
//                 ]
//             );

//             const messagesWithDate: Message[] = response.documents.map(doc => ({
//                 text: doc.text,
//                 isUser: doc.isUser,
//                 isCode: doc.isCode || false,
//                 $id: doc.$id,
//                 createdAt: new Date(doc.createdAt),
//             }));

//             setMessages(messagesWithDate);
//         } catch (err: any) {
//             console.error("Erreur lors de la récupération des messages :", err);
//             console.log("Erreur lors du chargement des messages.");
//         }
//     };

//     useEffect(() => {
//         if (appId) {
//             fetchMessages();
//         }
//     }, [appId]);

//     const getInitialPrompt = (projectType: 'web' | 'mobile') => {
//         if (projectType === 'web') {
//             return `Tu es un expert en création de sites web fullstack, avec une forte expertise en design, similaire aux sites de Framer. **Tu utilises systématiquement Vite.js avec React, TypeScript et Tailwind CSS pour le styling.** Tu es capable de proposer des structures de projet complètes et bien organisées, et de générer le code source pour chaque fichier que tu as defini dans la structure du projet que tu as creer meme si il s'agit d'un fichier de styles comme par exemple App.css, index.css (dans le dossier src) ou tout autres. Sois très précis et complet. Genere un fichier package.json avec les dépendances qui seront utilisées pour le site, **en incluant Tailwind CSS et ses dépendances peer.**
    
//                 **Important (Design & Styling) :**
    
//                 *   **Tailwind CSS :**  **Tailwind CSS est ton outil principal pour le styling.** Utilise les classes utilitaires de Tailwind CSS de manière efficace pour créer un design responsive et cohérent.
//                 *   **Configuration de Tailwind CSS :** Génère un fichier \`tailwind.config.js\` à la racine du projet avec une configuration de base appropriée (par exemple, la configuration des polices, des couleurs, des breakpoints, etc.).
//                 *   **Polices :** Utilise les polices Google Fonts suivantes :
//                     *   DM Sans (police principale par défaut)
//                     *   Space Grotesk (sans serif)
//                     *   Poppins (sans serif)
    
//                     Elle peut choisir d'utiliser l'une de ces polices en fonction du style et de l'objectif du site web.  Configure Tailwind CSS pour utiliser ces polices.
//                 *   **Style Général :** Vise un design moderne, épuré et professionnel. Utilise des espaces blancs généreux, une palette de couleurs harmonieuse (maximum 3-4 couleurs principales), et une typographie claire et lisible.
//                 *   **Responsivité :** Le site doit être entièrement responsif et s'adapter à toutes les tailles d'écran (desktop, tablette, mobile).  Utilise les prefixes de breakpoint de Tailwind CSS (sm, md, lg, xl, 2xl) pour adapter les styles aux différentes tailles d'écran.
//                 *   **Composants Réutilisables :** Crée des composants React réutilisables avec des styles cohérents en utilisant Tailwind CSS.
//                 *   **Transitions et Animations :** Utilise des transitions et des animations subtiles pour améliorer l'expérience utilisateur en utilisant les classes de transition de Tailwind CSS.
    
//                 **Important :** Pour assurer le bon fonctionnement du projet Vite avec Tailwind CSS, assure-toi que la structure du projet inclut les fichiers et dossiers suivants :
    
//                 *   \`index.html\` (point d'entrée principal de l'application Vite, essentiel pour le rendu initial, à la racine du projet).  **Inclus les polices (DM Sans, Space Grotesk, Poppins) ici.**
//                 *   \`src/index.css\` (fichier de styles global pour le site).  **Contient l'import de Tailwind CSS (\`@tailwind base; @tailwind components; @tailwind utilities;\`). Doit être dans le dossier \`src\`**
//                 *   \`tailwind.config.js\` (fichier de configuration de Tailwind CSS, à la racine du projet).
//                 *   \`postcss.config.js\` (fichier de configuration de PostCSS, à la racine du projet, nécessaire pour Tailwind CSS).
//                 *   \`src/App.tsx\` (ou \`src/App.jsx\`) : Le composant racine de l'application React.
//                 *   \`tsconfig.json\` (configuration TypeScript de base pour le projet, à la racine).
//                 *   \`tsconfig.node.json\` (configuration TypeScript additionnelle pour l'environnement Node, souvent nécessaire pour les outils de build, à la racine).
//                 *   \`eslint.config.js\` (configuration ESLint pour l'analyse statique du code et le respect des normes de codage, à la racine).
//                 *   \`.gitignore\` (fichier de configuration Git pour exclure les fichiers non suivis, à la racine).
//                 *   \`README.md\` (fichier de documentation du projet, à la racine).
    
//                 Ces fichiers et dossiers sont cruciaux pour la configuration et le bon fonctionnement du projet. Tu peux ensuite ajouter d'autres fichiers et dossiers selon les besoins du projet. De plus, pour chaque composant React que tu vas créer, utilise systématiquement Tailwind CSS pour le styling. Même si un composant a un style très simple, utilise Tailwind CSS pour cela.
//                 `;
//         } else { // projectType === 'mobile'
//             return `Tu es un expert en création d'applications mobiles avec React Native et Expo, utilisant Expo Router pour la navigation. **Ton objectif principal est de créer une application qui répond précisément à la description et aux besoins de l'utilisateur. Cela inclut la génération de la structure de navigation (onglets, piles) et des écrans spécifiques à l'application demandée, en plus de la structure de base Expo Router.**
    
//                  **Important :** Pour assurer le bon fonctionnement du projet React Native et Expo, assure-toi que la structure du projet inclut *TOUS* les fichiers et dossiers suivants :
    
//                 *   \`package.json\` : (Contient les dépendances et les scripts. **Ce fichier *DOIT* avoir *EXACTEMENT* le contenu suivant :** )
//                 \`\`\`json
//                 {
//                   "name": "bolt-expo-starter",
//                   "main": "expo-router/entry",
//                   "version": "1.0.0",
//                   "private": true,
//                   "scripts": {
//                     "dev": "EXPO_NO_TELEMETRY=1 expo start",
//                     "build:web": "expo export --platform web",
//                     "lint": "expo lint"
//                   },
//                   "dependencies": {
//                     "@expo-google-fonts/inter": "^0.2.3",
//                     "@expo/vector-icons": "^14.0.2",
//                     "@lucide/lab": "^0.1.2",
//                     "@react-navigation/bottom-tabs": "^7.2.0",
//                     "@react-navigation/native": "^7.0.14",
//                     "expo": "52.0.33",
//                     "expo-blur": "^14.0.3",
//                     "expo-constants": "^17.0.5",
//                     "expo-font": "^13.0.3",
//                     "expo-haptics": "^14.0.1",
//                     "expo-linear-gradient": "^14.0.2",
//                     "expo-linking": "^7.0.5",
//                     "expo-router": "4.0.17",
//                     "expo-splash-screen": "^0.29.21",
//                     "expo-status-bar": "^2.0.1",
//                     "expo-symbols": "^0.2.2",
//                     "expo-system-ui": "^4.0.7",
//                     "expo-web-browser": "^14.0.2",
//                     "lucide-react-native": "^0.475.0",
//                     "react": "18.3.1",
//                     "react-dom": "18.3.1",
//                     "react-native": "0.76.6",
//                     "react-native-gesture-handler": "^2.23.0",
//                     "react-native-reanimated": "^3.16.7",
//                     "react-native-safe-area-context": "4.12.0",
//                     "react-native-screens": "^4.4.0",
//                     "react-native-svg": "^15.11.1",
//                     "react-native-url-polyfill": "^2.0.0",
//                     "react-native-web": "^0.19.13",
//                     "react-native-webview": "13.12.5",
//                     "@react-native-async-storage/async-storage": "1.21.0"
//                   },
//                   "devDependencies": {
//                     "@babel/core": "^7.25.2",
//                     "@types/react": "~18.3.12",
//                     "typescript": "^5.3.3"
//                   }
//                 }
//                 \`\`\`
    
//                 *   \`app/(tabs)/_layout.tsx\` : (Layout pour la navigation par onglets. **Ce fichier *DOIT* être créé et modifié pour configurer les onglets spécifiques à l'application demandée.**)
//                 *   \`app/(tabs)/index.tsx\` : (Écran d'accueil par défaut pour la navigation par onglets. **Ce fichier *DOIT* être créé.**)
    
//                 *OU*
    
//                 *   \`app/_layout.tsx\` : (Layout racine de l'application. **Ce fichier *DOIT* être créé et utilisé si la navigation n'est *PAS* basée sur des onglets.**  Dans ce cas, *NE PAS* générer \`app/(tabs)/_layout.tsx\` ou \`app/(tabs)/index.tsx\`.)
    
//                 *   \`app/+not-found.tsx\` : (Gestion des erreurs 404, **ce fichier *DOIT* être créé.**)
    
//                 *   \`tsconfig.json\` : (Configuration TypeScript, **ce fichier *DOIT* être créé.**)
//                 *   \`App.js\` : (Point d'entrée principal de l'application, **ce fichier *DOIT* être créé.**)
//                 *   \`app.json\` : (Configuration de l'application Expo, **ce fichier *DOIT* être créé.**)
//                 *   \`babel.config.js\` : (Configuration Babel, **ce fichier *DOIT* être créé.**)
//                 *   \`expo-env.d.ts\` : (Déclarations de type pour Expo, **ce fichier *DOIT* être créé.**)
    
//                 **Important :** La structure de répertoires *DOIT* être respectée. Si la navigation par onglets est utilisée, les fichiers d'écran (comme \`index.tsx\`) *DOIVENT* être placés dans le répertoire \`app/(tabs)/\`.
    
//                 **Important: Afin d'assurer la bonne creation de l'application n'oublie aucun des fichiers du directories de app et suit les**
    
//                 1.  **Analyse approfondie :** Lis attentivement la demande de l'utilisateur. Identifie le *but* de l'application, les *fonctionnalités* essentielles, les *écrans* nécessaires, et toute indication de *style* ou de *design*.
//                 2.  **Planification de la navigation :** Détermine si l'application doit utiliser une navigation par onglets (auquel cas tu modifieras \`app/(tabs)/_layout.tsx\`) ou une navigation en pile (auquel cas tu utiliseras \`app/_layout.tsx\`). Identifie les écrans qui doivent être inclus dans la navigation.
//                 3.  **Création des écrans :** Crée les fichiers \`.tsx\` pour chaque écran identifié dans le répertoire \`app\`. Utilise des noms de fichiers descriptifs (par exemple, \`app/notes.tsx\`, \`app/settings.tsx\`).
//                 4.  **Configuration de la navigation :**
//                     *   **Navigation par onglets :** Modifie le fichier \`app/(tabs)/_layout.tsx\` pour configurer les onglets en utilisant le composant \`<Tabs>\` d'Expo Router. Chaque \`<Tabs.Screen>\` doit correspondre à un fichier d'écran créé à l'étape précédente. Utilise des icônes appropriées pour chaque onglet.
//                     *   **Navigation en pile :** Modifie le fichier \`app/_layout.tsx\` pour configurer la navigation en pile en utilisant le composant \`<Stack>\` d'Expo Router. Chaque \`<Stack.Screen>\` doit correspondre à un fichier d'écran créé à l'étape précédente.
//                 5.  **Mise à jour du \`package.json\` :**
//                     *   **Analyse des dépendances :** Identifie toutes les dépendances React Native et Expo nécessaires pour implémenter les fonctionnalités demandées par l'utilisateur (par exemple, \`react-native-reanimated\` pour les animations complexes, \`@react-native-async-storage/async-storage\` pour le stockage local, \`lucide-react-native\` pour les icônes).
//                     *   **Ajout des dépendances :** Ajoute les dépendances identifiées à la section \`dependencies\` du \`package.json\`.
//                     *   **Vérification du script \`dev\` :** Assure-toi que la section \`scripts\` du \`package.json\` contient un script nommé \`dev\` avec la valeur \`"EXPO_NO_TELEMETRY=1 expo start"\`. **C'EST ESSENTIEL.**
//                 6.  **Implémentation des fonctionnalités :**
//                     *   **Composants réutilisables :** Crée des composants React Native réutilisables pour les éléments d'interface utilisateur communs (par exemple, boutons, champs de texte, listes).
//                     *   **Gestion des données :** Choisis une méthode appropriée pour gérer les données (par exemple, états React, contexte React, Redux,zustand ou AsyncStorage).
//                     *   **API :** Si l'application a besoin de données externes, utilise l'API Fetch ou une bibliothèque similaire pour communiquer avec des services web.
//                     *   **Style :** Choisis une approche de style (par exemple, feuilles de style CSS, Styled Components, Tailwind CSS) et applique-la de manière cohérente.
//                     7.  **Priorisation de la clarté et de la maintenabilité :** Écris un code clair, bien commenté et facile à comprendre. Utilise des noms de fichiers et de variables descriptifs.
//                     8.  **Gestion des erreurs :** Anticipe les erreurs potentielles et inclus une gestion des erreurs appropriée.
    
//                 **Important :**
    
//                 *   Génère uniquement les fichiers et répertoires *nécessaires* pour répondre à la demande de l'utilisateur. Ne génère pas de code inutile ou excessif.
//                 *   Respecte la structure de base Expo Router mentionnée ci-dessus.
//                 *   Le script \`dev\` dans \`package.json\` doit *toujours* être \`"EXPO_NO_TELEMETRY=1 expo start"\`.
//                 *   Ne génère pas de code inutile pour \`App.js\`, \`app.json\`, \`babel.config.js\` et \`expo-env.d.ts\` car ils sont déjà configurés par Expo et n'ont généralement pas besoin d'être modifiés directement. Concentre-toi sur le code spécifique à l'application demandée.
//                 *   **L'objectif principal est de générer une application fonctionnelle avec une navigation correcte, basée sur la demande de l'utilisateur.**
//                 `;
//         }
//     };
//     const fileExtractionPrompt = `Pour faciliter l'extraction automatique du code, utilise le format suivant pour chaque fichier :

// \`\`\`
// Nom du fichier: nom_du_fichier.extension
// <Extracted_code>
// // Code source du fichier
// </Extracted_code>
// \`\`\`

// Par exemple :

// \`\`\`
// Nom du fichier: src/components/Button.tsx
// <Extracted_code>
// import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   onClick?: () => void;
// }

// const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
//   return (
//     <button onClick={onClick}>
//       {children}
//     </button>
//   );
// };

// export default Button;
// </Extracted_code>
// \`\`\``;
//     const projectStructurePrompt = `Présente la structure du projet sous forme de liste Markdown.
// Si la question n'est pas directement liée au développement web ou à la génération de code, réponds de manière conversationnelle sans mentionner ton expertise en développement web.`;

// const sendMessage = async () => {
//     if (!userPrompt.trim() || isSending || !appId) return;

//     setIsSending(true);
//     const newMessage = { text: userPrompt, isUser: true };
//     setMessages(prevMessages => [...prevMessages, newMessage]);
//     setUserPrompt('');

//     // Cacher les éléments après l'envoi du premier message
//     setAreElementsHidden(true);


//     try {
//         const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

//         if (!apiKey) {
//             console.error("GEMINI_API_KEY is missing in environment variables.");
//             setMessages(prevMessages => [...prevMessages, { text: "Error: API Key is missing in environment variables.", isUser: false }]);
//             setIsSending(false);
//             return;
//         }

//         const genAI = new GoogleGenerativeAI(apiKey);

//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.0-flash",
//         });

//         const initialPrompt = getInitialPrompt(projectType);
//         const input = initialPrompt + "\n\n" + fileExtractionPrompt + "\n\n" + projectStructurePrompt + "\n\n" + userPrompt;

//         const result = await model.generateContent(input);
//         let responseText = result.response.text();

//         const extractedFiles = extractCodeFiles(responseText);
//         setCodeFiles(extractedFiles);

//         const isCodeResponse = responseText.includes("<Extracted_code>");

//         const geminiMessage = { text: responseText, isUser: false, isCode: isCodeResponse };
//         setMessages(prevMessages => [...prevMessages, geminiMessage]);

//         await saveMessageToAppwrite({ ...newMessage, appId: appId, createdAt: new Date() });
//         await saveMessageToAppwrite({ ...geminiMessage, appId: appId, createdAt: new Date() });

//     } catch (error: any) {
//         console.error("Error calling Gemini API:", error);
//         setMessages(prevMessages => [...prevMessages, { text: `Error: ${error}`, isUser: false }]);
//     } finally {
//         setIsSending(false);
//     }
// };

//     const saveMessageToAppwrite = async (message: any) => {
//         try {
//             await databases.createDocument(
//                 databaseId,
//                 collectionId,
//                 ID.unique(),
//                 {
//                     appId: message.appId,
//                     text: message.text,
//                     isUser: message.isUser,
//                     isCode: message.isCode || false,
//                     createdAt: message.createdAt.toISOString(),
//                 }
//             );
//             fetchMessages();
//         } catch (err: any) {
//             console.error("Erreur lors de la sauvegarde du message dans Appwrite :", err);
//         }
//     };

//     const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setUserPrompt(event.target.value);
//     };

//     const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
//         if (event.key === 'Enter') {
//             sendMessage();
//         }
//     };

//     const extractCodeFiles = (text: string): CodeFile[] => {
//         const files: CodeFile[] = [];
//         // Regex amélioré pour gérer les underscores, les parenthèses et autres caractères spéciaux dans les noms de fichiers
//         const regex = /Nom du fichier:\s*([a-zA-Z0-9\/._+()\s-]+?\.[a-z]+)\s*<Extracted_code>\s*([\s\S]*?)\s*<\/Extracted_code>/gi;
//         let match;
    
//         while ((match = regex.exec(text)) !== null) {
//             const filename = match[1];
//             const code = match[2].trim();
//             files.push({ filename, code });
//         }
    
//         return files;
//     };
//     const CodeFileList = ({ codeFiles }: { codeFiles: CodeFile[] }) => {
//         return (
//             <div>
//                 {codeFiles.map((file, index) => (
//                     <div key={index}>
//                         <p><strong>{file.filename}</strong></p>
//                         <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
//                             {file.code}
//                         </pre>
//                         <button onClick={() => downloadCode(file.filename, file.code)}>
//                             Download
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     const downloadCode = (filename: string, code: string) => {
//         const blob = new Blob([code], { type: 'text/plain' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     };

//     const GeminiIcon = () => (
//         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M20 10.0196C14.6358 10.3431 10.3431 14.6358 10.0196 20H9.98042C9.65687 14.6358 5.36425 10.3431 0 10.0196V9.98043C5.36425 9.65688 9.65687 5.36424 9.98042 0H10.0196C10.3431 5.36424 14.6358 9.65688 20 9.98043V10.0196Z" fill="url(#paint0_radial_809_11874)"/>
//             <defs>
//                 <radialGradient id="paint0_radial_809_11874" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.13727 9.97493) scale(21.6266 172.607)">
//                     <stop offset="0.385135" stop-color="#9E72BA"/>
//                     <stop offset="0.734299" stop-color="#D65C67"/>
//                     <stop offset="0.931035" stop-color="#D6635C"/>
//                 </radialGradient>
//             </defs>
//         </svg>
//     );
    

//     // Static package.json for mobile projects
    


    


//     return (
//         <div className="flex flex-col h-full md:not-sr-only sr-only pointer-events-none select-none">
//             {/* Header */}
//             <header className="bg-gray-50 p-4  flex items-center justify-center"> {/* Ajout du flex pour aligner les éléments */}
//                 {/* <h1 className="text-xl font-semibold">Chat with AI Builder</h1> */}
//                 <div className='flex items-center gap-1   rounded-full bg-[#fafafa]'>
//                     <div className='p-1 px-2 py-[6px] bg-[#eee] cursor-pointer rounded-full'>
//                     <svg width="20" className='h-[18px] w-[18px]' height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M20 10.0196C14.6358 10.3431 10.3431 14.6358 10.0196 20H9.98042C9.65687 14.6358 5.36425 10.3431 0 10.0196V9.98043C5.36425 9.65688 9.65687 5.36424 9.98042 0H10.0196C10.3431 5.36424 14.6358 9.65688 20 9.98043V10.0196Z" fill="url(#paint0_radial_809_11874)" />
//   <defs>
//     <radialGradient id="paint0_radial_809_11874" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.13727 9.97493) scale(21.6266 172.607)">
//       <stop offset="0.385135" stop-color="#9E72BA" />
//       <stop offset="0.734299" stop-color="#D65C67" />
//       <stop offset="0.931035" stop-color="#D6635C" />
//     </radialGradient>
//   </defs>
// </svg>
//                     </div>
//                     <div  className='p-1 px-2 py-[6px] cursor-pointer rounded-full'>
//                     <svg xmlns="http://www.w3.org/2000/svg" className='h-[18px] w-[18px]' viewBox="0 0 28 28" fill="#000">
//           <path d="M 6 2 L 24 2 L 24 11 L 15 11 Z M 6 11 L 15 11 L 24 20 L 15 20 L 15 29 L 6 20 Z"></path>
//       </svg>
//                     </div>
//                 </div>
//                 <div>
//                 <div className="flex items-center gap-4">
//     <label className="mr-4">
        
//         <select 
//             value={projectType} 
//             onChange={(e) => setProjectType(e.target.value as 'web' | 'mobile')}
//             className="sr-only" // Ajoute cette classe pour masquer l'élément
//         >
//             <option value="web">Web</option>
//             <option value="mobile">Mobile (React Native Expo)</option>
//         </select>
//     </label>

//     {/* Sélecteur personnalisé */}
    
// </div>

//                     {webContainerURL && (
//                         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleIframeSize}>
//                             {isIframeExtended ? 'Restore Preview' : 'Extend Preview'}
//                         </button>
//                     )}
//                 </div>
//             </header>

//             {/* Main Content */}
//             <div className="flex-grow  flex flex-col md:flex-row overflow-hidden">
//                 {/* Chat Zone */}
//                 <div className={`flex-grow flex flex-col p-4 ${webContainerURL ? 'md:w-1/2' : 'md:w-full'}`}>
//                     {/* Messages Display */}
//                     <div className="flex-grow overflow-y-auto space-y-2">
//                         {messages.map((message, index) => (
//                             <div
//                                 key={message.$id || index}
//                                 className={`flex items-start ${message.isUser ? 'justify-end' : 'justify-start'}`}
//                             >
//                                 {!message.isUser && (
//                                     <div className="mr-2">
//                                         <GeminiIcon />
//                                     </div>
//                                 )}
//                                 <div
//                                     className={`rounded-xl rounded-tr-[3px] px-4 py-3 ${message.isUser
//                                         ? 'bg-[#E9EEF6] '
//                                         : 'text-[17px]'
//                                     }`}
//                                     style={{ maxWidth: '80%' }}
//                                 >
//                                     {message.isCode ? (
//                                         <pre className="whitespace-pre-wrap  ">{message.text}</pre>
//                                     ) : (
//                                         <p className="whitespace-pre-wrap font-semIbold">{message.text}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                        {/* <div
//     className={`h-full w-full flex items-center justify-center gap-1 transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
// >
//                             <div className='h-[550px] w-[320px] flex flex-col p-2 rounded-[40px] border border-[#FAFAFA]'>
//                                 <div className='h-[25px] w-full'>

//                                 </div>
//                                 <div className='mt-2 w-full h-full  flex flex-col gap-1 pointer-events-none select-none'>
//                                     <div className="w-full px-2 flex flex-col gap-10">
//                                         <h1 className="text-3xl grotesk font-semibold flex gap-1 items-center">
//                                              <svg fill="var(--rui-color-white)" viewBox="0 0 145 32" xmlns="http://www.w3.org/2000/svg" className="sc-81786132-0 bmMKuq h-[24px] w-[84px]"><path clip-rule="evenodd" d="m98.8039 0h5.6871v31.7312h-5.6871zm46.0571 13.3685v-4.92408h-5.881v-6.41996h-5.687v23.40534c0 2.1506.541 3.7895 1.608 4.8714 1.066 1.0828 2.728 1.6317 4.939 1.6317h5.021v-4.924h-3.674c-.799 0-1.372-.1757-1.704-.5226-.305-.3175-.503-1.1195-.503-2.043v-11.0748zm-84.6893 12.1865 5.8804-17.11125h5.9749l-8.4889 23.28775h-6.7327l-8.489-23.28775h5.9749zm63.8513-5.4451c0 1.4743-.224 2.7569-.664 3.8121-.437 1.0495-1.063 1.8541-1.861 2.3908s-1.779.8089-2.916.8089c-1.626 0-2.853-.5344-3.646-1.5878-.802-1.0646-1.209-2.6781-1.209-4.7954v-12.29412h-5.687v12.92272c0 2.0122.251 3.7189.748 5.0721.497 1.3573 1.18 2.4614 2.029 3.281.849.8187 1.84 1.41 2.946 1.7581 1.1.3463 2.284.5217 3.518.5217 1.778 0 3.25-.3225 4.373-.9586 1.024-.5819 1.883-1.2622 2.555-2.0251l.509 2.7148h4.992v-23.28672h-5.687zm-33.913-10.43745c-1.7923-.99372-3.9206-1.49716-6.3249-1.49716-2.3749 0-4.4953.50344-6.3024 1.49684-1.8092.99597-3.2308 2.40247-4.2254 4.18037-.9931 1.7763-1.4966 3.8817-1.4966 6.2574 0 2.3466.5035 4.4373 1.4966 6.2136.994 1.7773 2.4159 3.1835 4.2254 4.1793 1.8071.9935 3.9276 1.4969 6.3024 1.4969 2.4042 0 4.5325-.5034 6.3249-1.4972 1.7942-.9953 3.2082-2.4014 4.2026-4.179.9934-1.7773 1.4971-3.868 1.4971-6.2136 0-2.3748-.5037-4.4802-1.4971-6.2575-.995-1.7781-2.4087-3.1847-4.2026-4.17995zm-3.0047 16.63905c-.9162.5966-2.0332.8993-3.3199.8993-1.2572 0-2.367-.3026-3.2986-.8995-.9332-.5976-1.665-1.441-2.1757-2.5072-.5128-1.0672-.7732-2.3099-.7732-3.6942 0-1.4128.2601-2.6627.7732-3.7154.5104-1.0518 1.2428-1.8955 2.1769-2.5081.9313-.612 2.0408-.9222 3.2973-.9222 1.2861 0 2.4025.3102 3.319.9215.9191.613 1.6443 1.457 2.1559 2.5091.5125 1.0552.7725 2.3052.7725 3.7152 0 1.3811-.26 2.6242-.7725 3.6941-.5115 1.0664-1.2364 1.9099-2.1549 2.5074zm-81.19475-18.48035h-5.91055v23.90035h5.91055zm18.53525 1.36671c0-5.07148-4.1298-9.19751668-9.2063-9.19751668h-15.2395v5.10407668h14.5149c2.2974 0 4.2004 1.80488 4.2425 4.02316.021 1.11072-.3959 2.15902-1.1738 2.95172-.7782.7929-1.818 1.2299-2.9278 1.2299h-5.65434c-.20074 0-.36413.1631-.36413.3639v4.5363c0 .0772.02383.1509.06866.213l9.59341 13.3092h7.0225l-9.6157-13.3456c4.8425-.2431 8.7396-4.3118 8.7396-9.18814zm18.1745.33907c-1.7026-.90368-3.7242-1.36164-6.0087-1.36164-2.2874 0-4.3325.50376-6.0787 1.4978-1.7491.99501-3.1251 2.40181-4.0897 4.18061-.9636 1.7748-1.452 3.8949-1.452 6.3017 0 2.3457.4959 4.4357 1.4746 6.2123.9808 1.7807 2.3955 3.1797 4.2041 4.158 1.8052.9784 3.9706 1.4743 6.4354 1.4743 1.9554 0 3.7114-.3663 5.2192-1.0894 1.5081-.7249 2.7393-1.712 3.6596-2.9341.8742-1.1615 1.464-2.4752 1.7525-3.9042l.0311-.1525h-5.6559l-.0267.0916c-.3114 1.0659-.9156 1.9081-1.7964 2.5038-.9454.6405-2.1066.9654-3.4519.9654-1.1402 0-2.17-.2443-3.0605-.7261-.8862-.479-1.5791-1.164-2.059-2.0367-.4818-.8757-.756-1.9294-.8146-3.1254v-.187h17.0842l.0191-.1044c.0596-.3278.0979-.6656.1145-1.0053.0141-.331.0223-.6616.0223-.9953-.0305-2.2563-.5348-4.2409-1.4987-5.8993-.9677-1.6603-2.3215-2.9605-4.0238-3.86417zm-2.0724 4.38547c.9717.8178 1.5762 1.9799 1.7979 3.4564h-11.2467c.1285-.958.4466-1.7877.9463-2.4683.5242-.7139 1.1957-1.2748 1.9962-1.6672.8014-.3936 1.6813-.5934 2.6148-.5934 1.5781-.0001 2.8874.4281 3.8915 1.2725z" fill-rule="evenodd"></path></svg>
                                             
//                                         </h1>
//                                         <div className='w-full flex flex-col gap-1 items-center justify-center'>
//                                             <h1 className="text-3xl font-semibold">
//                                                 Solde
//                                             </h1>
//                                             <h1 className="text-5xl font-semibold">
//                                                 6,055 €
//                                             </h1>
//                                             <div className="w-full flex items-center justify-center mt-2 gap-1">
//                                                 <div className='flex w-1/2 justify-center items-center gap-1 py-2 px-2 rounded-[12px] bg-[#fafafa]'>
//                                                     <Plus></Plus>
//                                                     <p className="font-semibold">Add</p>
//                                                 </div>
//                                                 <div className='flex w-1/2 justify-center items-center gap-1 py-2 px-2 rounded-[12px] bg-[#fafafa]'>
//                                                     <ArrowDown></ArrowDown>
//                                                     <p className="font-semibold">Withdraw</p>
//                                                 </div>
//                                             </div>
//                                             <div className="mt-3 flex flex-col w-full gap-2">
//                                                <div className="flex items-center w-full justify-between">
//                                                <h2 className="text-1xl font-semibold">Cards</h2>
//                                                <ChevronRight></ChevronRight>
//                                                </div>
//                                                <div className="relative w-full rounded-[10px] bg-[#fafafa] p-2 border border-[#FAFAFA] h-[150px]">
//                                                     <div className="flex items-center justify-between">
//                                                         <h2 className="text-[15px] font-semibold">Guillaume's Card</h2>
//                                                         <div>
                                                            
// <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <g clip-path="url(#clip0_9683_87428)">
// <path d="M17.6935 7.3099L15.3355 18.2878H12.484L14.8429 7.3099H17.6935ZM29.6911 14.398L31.192 10.2762L32.0558 14.398H29.6911ZM32.8728 18.2878H35.5102L33.2081 7.3099H30.7738C30.2264 7.3099 29.7648 7.6272 29.5603 8.1153L25.2811 18.2878H28.2754L28.8701 16.6479H32.5285L32.8728 18.2878ZM25.43 14.7035C25.4421 11.8062 21.4069 11.6465 21.4347 10.3523C21.4433 9.95838 21.82 9.53963 22.6442 9.43261C23.0528 9.37931 24.1786 9.33862 25.4555 9.92391L25.9563 7.59607C25.2703 7.34812 24.3875 7.10938 23.289 7.10938C20.4704 7.10938 18.4868 8.60161 18.4701 10.7382C18.4519 12.3186 19.8859 13.2005 20.9662 13.7256C22.0777 14.2635 22.4505 14.609 22.4464 15.0901C22.4384 15.8265 21.5599 16.1516 20.7389 16.1643C19.3056 16.1863 18.4739 15.7781 17.8108 15.4711L17.294 17.8761C17.9603 18.1805 19.1901 18.4461 20.4652 18.4594C23.4611 18.4594 25.4207 16.9857 25.43 14.7035ZM13.6191 7.3099L8.99891 18.2878H5.98462L3.71102 9.52691C3.57293 8.98723 3.45304 8.78965 3.03325 8.56237C2.34791 8.19198 1.21596 7.84466 0.220215 7.62896L0.287872 7.3099H5.14012C5.75861 7.3099 6.31456 7.71993 6.45496 8.42928L7.65574 14.7817L10.6235 7.3099H13.6191Z" fill="#1434CB"/>
// </g>
// <defs>
// <clipPath id="clip0_9683_87428">
// <rect width="36" height="24" fill="white"/>
// </clipPath>
// </defs>
// </svg>

//                                                         </div>
//                                                     </div>
//                                                     <div className="flex items-center justify-between mt-21">
//                                                         <h2 className='font-semibold'>3600.05 €</h2>
//                                                     <div className="flex items-center gap-1">
//                                                         <div className="flex items-center font-semibold ">
//                                                        <p>....</p>
//                                                         </div>
//                                                         <div className="flex items-center gap-1 font-semibold">
//                                                         <p>....</p>
//                                                         </div>
//                                                         <div className="flex items-center gap-1 font-semibold">
//                                                         <p>....</p>
//                                                         </div>
//                                                         <div className="flex items-center gap-1 font-semibold">
//                                                         <p>4405</p>
//                                                         </div>
//                                                     </div>
//                                                     </div>
//                                                </div>
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                 </div>
//                             </div>
//                         </div> */}
//                     </div>
//                     <div className='relative z-10 bottom-4 flex flex-col gap-1 items-center justify-center'>
//                     {/* <div
//         className={`flex gap-2 bg-[#EEE] rounded-[10px] transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
//     >
//         <div 
//             className={`px-4 py-1 transition-colors duration-200 rounded-[25px] flex items-center justify-center cursor-pointer ${projectType === 'web' ? 'bg-black text-[#E4E4E4]' : 'font-semibold'}`}
//             onClick={() => setProjectType('web')}
//         >
//             Web
//         </div>
//         <div 
//             className={`px-4 py-[2px] transition-colors duration-200 rounded-[25px] flex items-center justify-center cursor-pointer ${projectType === 'mobile' ? 'bg-black text-[#E4E4E4]' : ' font-semibold'}`}
//             onClick={() => setProjectType('mobile')}
//         >
//             Mobile
//         </div>
//     </div> */}
//     {/* <div
//         className={`flex absolute justify-center items-center gap-1 -mt-28 transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
//     >
//                             <div className='flex transition-all select-none cursor-pointer hover:bg-[#fafafa] items-center whitespace-nowrap  justify-center px-2 py-1 border border-[#EEE] rounded-[10px] backdrop-blur-3xl z-20 gap-1'>
//                                 <div className='h-[27px] w-[27px] rounded-[10px]'>
//                                     <img src="public/icons/Netflix logo.png" className='rounded-[10px]' alt="" />
//                                 </div>
//                                 <h2 className="text-1xl font-semibold">Build me a Netflix clone</h2>
//                             </div>
//                             <div className='flex transition-all select-none cursor-pointer hover:bg-[#fafafa] items-center whitespace-nowrap  justify-center px-2 py-1 border border-[#EEE] rounded-[10px] backdrop-blur-3xl z-20 gap-1'>
//                                 <div className='h-[27px] w-[27px] rounded-[10px]'>
//                                     <img src="public/icons/Spotify logo.png" className='rounded-[10px]' alt="" />
//                                 </div>
//                                 <h2 className="text-1xl font-semibold">Build me a Spotify clone</h2>
//                             </div>
//                             <div className='flex transition-all select-none cursor-pointer hover:bg-[#fafafa] items-center whitespace-nowrap  justify-center px-2 py-1 border border-[#EEE] rounded-[10px] backdrop-blur-3xl z-20 gap-1'>
//                                 <div className='h-[27px] w-[27px] rounded-[10px]'>
//                                     <img src="public/icons/Threads logo.png" className='rounded-[10px]' alt="" />
//                                 </div>
//                                 <h2 className="text-1xl font-semibold">Build me a Threads clone</h2>
//                             </div>
//                         </div> */}
//                     <div className="md:w-[300px] h-[110px] mt-18  backdrop-blur-lg border border-[#EEE] rounded-[25px]">
//                             <div className='w-full p-2'>
//                                 <textarea
//                                     placeholder="Ask AI to build you an app..."
//                                     value={userPrompt}
//                                     onChange={handleInputChange}
//                                     onKeyDown={handleKeyDown}
//                                     disabled={isSending}
//                                     className="w-full h-[120px] p-3 border-none focus:outline-none rounded-[25px] resize-none"
//                                 />
//                             </div>
//                             <div className=" bottom-1 p-2 w-full absolute flex items-center justify-between">
//                                 <div className="items-center gap-1 flex">
//                                 <div >
//                                 {/* <Terminal
//     webContainer={webContainer}
//     codeFiles={codeFiles}
//     setWebContainerURL={setWebContainerURL}
//     projectType={projectType}
// /> */}
//                                 </div>

//                                     <div className="px-1 py-1 rounded-[12px]">
//                                     {userPrompt.trim() === '' ? (
//                                          <Paperclip size={18} color='#888' className='pointer-events-none'></Paperclip>
//                                     ) : (
//                                         <Paperclip size={18} color='#000' className='pointer-events-auto cursor-pointer'></Paperclip>
//                                     )}
                                       
//                                     </div>
//                                     <div className="px-1 py-1 rounded-[12px]">
//                                     {userPrompt.trim() === '' ? (
//                                          <Stars size={18} color='#888' className='pointer-events-none'></Stars>
//                                     ) : (
//                                         <Stars size={18} color='#000' className='pointer-events-auto cursor-pointer'></Stars>
//                                     )}
                                       
//                                     </div>
//                                     <div className="px-1 py-1 rounded-[12px]">
//                                     {userPrompt.trim() === '' ? (
//                                          <Mic size={18} color='#888' className='pointer-events-none'></Mic>
//                                     ) : (
//                                         <Mic size={18} color='#000' className='pointer-events-auto cursor-pointer'></Mic>
//                                     )}
                                       
//                                     </div>
//                                 </div>
//                                 <button onClick={sendMessage} disabled={isSending}>
//                                     {userPrompt.trim() === '' ? (
//                                         <div className="px-2 py-2 rounded-[12px] bg-[#fafafa]">
//                                             <Send size={22} />
//                                         </div>
//                                     ) : (
//                                         <div className="px-2 py-2 rounded-[12px] bg-[#000]">
//                                             <Send size={22} color="white" />
//                                         </div>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

                    

//                     {/* Message Input Zone  */}
//                     {/* <div className="mt-4">
//                         <div className='w-full flex items-center justify-center'>
                        
//                         </div>
//                     </div> */}
//                 </div>

//                 {/* Iframe (Displayed if webContainerURL exists) */}
//                 {webContainerURL && (
//                     <div className={`flex-grow overflow-hidden ${isIframeExtended ? 'md:w-full fixed top-0 z-[999]' : 'md:w-1/2'}`} style={{ height: '100%' }}>
//                         <iframe
//                             ref={iframeRef}
//                             src={webContainerURL}
//                             width="100%"
//                             height="100%"
//                             title="WebContainer Preview"
//                             className="border-none"
                            
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* WebContainerComponent  */}
//             <WebContainerComponent
//                 codeFiles={codeFiles}
//                 setWebContainerURL={setWebContainerURL}
//                 projectType={projectType} // Passe le type de projet au composant WebContainer
//             />

//             {/* Extracted Files Zone (Hidden) */}
//             <div className="sr-only">
//                 <CodeFileList codeFiles={codeFiles} />
//             </div>
//         </div>
//     );
// };

// export default BuilderExample;