import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import WebContainerComponent from './WebContainerComponent';
import { Paperclip, Send, Mic, Stars  } from "lucide-react";
import { useParams } from 'react-router-dom';
import { Client, Databases, ID, Query } from 'appwrite';


import { motion } from "framer-motion"


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


// Initialiser Appwrite (assurez-vous que ces valeurs sont correctes et dans un .env)
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679d739b000950dfb1e0');

const databases = new Databases(client);

const Builder = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userPrompt, setUserPrompt] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
    const [webContainerURL, setWebContainerURL] = useState<string | null>(null);
    const [isIframeExtended, setIsIframeExtended] = useState<boolean>(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [projectType, setProjectType] = useState<'web' | 'mobile'>('web');
    const { id: appId } = useParams<{ id: string }>();
    // const [ setError] = useState<string>('');
 

   
    const [isWebContainerActive, setIsWebContainerActive] = useState(false);

    const handleWebContainerStart = () => {
        setIsWebContainerActive(true);
    };

    const handleWebContainerStop = () => {
        setIsWebContainerActive(false);
    };
   

    //Nouvel état pour cacher le selecteur  + les suggestions
    const [areElementsHidden, setAreElementsHidden] = useState<boolean>(() => {
        //On recupere la valeur dans local storage
        const storedValue = localStorage.getItem(`elementsHidden-${appId}`);
        //Si elle existe on retourne sa valeur booleenne, sinon on retourne false
        return storedValue ? JSON.parse(storedValue) : false;
    });

    const [lastAIMessageWithCode, setLastAIMessageWithCode] = useState<Message | null>(null);
    const lastWebContainerCodeRef = useRef<string | null>(null);

    useEffect(() => {
        localStorage.setItem(`elementsHidden-${appId}`, JSON.stringify(areElementsHidden));
    }, [areElementsHidden,appId]);
    

    useEffect(() => {
        if (messages.length > 0) {
            setAreElementsHidden(true);
        }
    }, [messages]);

    const toggleIframeSize = () => {
        setIsIframeExtended(!isIframeExtended);
    };

    const databaseId = 'Boodupy-database-2025';
    const collectionId = 'discutes-200900';

    const fetchMessages = async () => {
        if (!appId) {
            console.error("ID de l'application non trouvé dans l'URL.");
            return;
        }
    
        try {
            const response = await databases.listDocuments(databaseId, collectionId, [
                Query.equal('appId', appId),
                Query.orderAsc('createdAt'),
            ]);
    
            const messagesWithDate: Message[] = response.documents.map(doc => ({
                text: doc.text,
                isUser: doc.isUser,
                isCode: doc.isCode || false,
                $id: doc.$id,
                createdAt: new Date(doc.createdAt),
            }));
    
            setMessages(messagesWithDate);
    
            // Vérifiez tous les messages pour le dernier message contenant du code
            const lastCodeMessage = messagesWithDate
                .filter(message => message.isCode)
                .pop() || null;
    
            if (lastCodeMessage) {
                setLastAIMessageWithCode(lastCodeMessage);
                lastWebContainerCodeRef.current = lastCodeMessage.text; // Mettre à jour la référence
            } else {
                setLastAIMessageWithCode(null);
                lastWebContainerCodeRef.current = null;
            }
    
        } catch (err: any) {
            console.error("Erreur lors de la récupération des messages :", err);
        }
    };

     useEffect(() => {
        if (appId) {
            fetchMessages();
        }
    }, [appId]);

    

    const [isReloaded, setIsReloaded] = useState<boolean>(() => {
        // Vérifie si une variable a été définie dans sessionStorage en fonction de l'appId
        const storedValue = sessionStorage.getItem(`isSessionStarted-${appId}`);
        return storedValue === 'true'; // Convertit la chaîne en booléen
    });

    useEffect(() => {
        // Au premier montage du composant (ou après un rechargement volontaire),
        // définit une variable dans sessionStorage pour indiquer que la session a commencé.
        // Utilise l'appId pour rendre la clé unique.
        if (appId) {
            sessionStorage.setItem(`isSessionStarted-${appId}`, 'true');
        }
    }, [appId]); // Dépendance sur appId

    

const [projectStructure, setProjectStructure] = useState<string>('');

useEffect(() => {
    console.log("Project structure will be set.");
}, [setProjectStructure]);

useEffect(() => {
    console.log("codeFiles:", codeFiles);
}, [codeFiles]);


const Improve_Prompt = `
**Objectif :** Améliorer radicalement la qualité et la complétude de la génération de projets (sites web ou applications) par l'IA, en assurant une expérience full-stack prête à l'emploi, même avec des prompts utilisateurs limités.

**Stratégie :**

1. **Analyse Approfondie du Prompt :**
   - Détermine le *type* de projet (site web, application mobile, etc.).
   - Identifie les *fonctionnalités* clés implicites (par exemple, si l'utilisateur demande un "Netflix clone", comprends qu'il faut : authentification, navigation par catégories, lecture de vidéos, gestion des profils, etc.).
   - Déduis le *public cible* et le *but* du projet pour orienter les choix de design et de fonctionnalités.
   - Si le prompt est vague, prends des *décisions par défaut intelligentes* (par exemple, utilise un thème sombre pour un "Netflix clone", propose une structure de base avec une page d'accueil, une page de connexion, etc.).

2. **Génération Full-Stack Complète :**
   - **Base de données :** Choisis une base de données appropriée (par exemple, Firebase, Supabase, MongoDB) et génère le code nécessaire pour :
     - Définir les modèles de données (utilisateurs, vidéos, catégories, etc.).
     - Implémenter les opérations CRUD (créer, lire, mettre à jour, supprimer) pour chaque modèle.
     - Sécuriser l'accès aux données.
   - **Backend (API) :** Crée une API RESTful ou GraphQL avec les endpoints nécessaires pour :
     - L'authentification (inscription, connexion, déconnexion).
     - La gestion des utilisateurs et des profils.
     - La récupération des données (vidéos, catégories, etc.).
     - La lecture de vidéos (intégration avec un service de streaming ou stockage de vidéos).
   - **Frontend (Interface Utilisateur) :**
     - Crée une structure de navigation claire et intuitive.
     - Implémente les composants UI nécessaires (lecteur vidéo, listes de vidéos, formulaires, etc.).
     - Connecte l'interface utilisateur à l'API pour afficher les données et permettre aux utilisateurs d'interagir avec l'application.
     - Gère les états de l'application (chargement, erreurs, etc.).

3. **Gestion des Erreurs et Sécurité :**
   - Anticipe les erreurs potentielles (erreurs de connexion à la base de données, erreurs d'API, etc.) et inclus une gestion des erreurs robuste.
   - Sécurise l'application contre les attaques courantes (injection SQL, XSS, CSRF, etc.).
   - Valide les données côté client et côté serveur.
   - Utilise des pratiques de sécurité modernes (HTTPS, chiffrement des mots de passe, etc.).

4. **Tests et Déploiement :**
   - Génère des tests unitaires et d'intégration pour assurer la qualité du code.
   - Fournis des instructions claires pour déployer l'application sur une plateforme appropriée (Netlify, Vercel, AWS, etc.).

**Format de sortie :**
- Structure de projet claire et organisée.
- Code source complet et bien commenté pour chaque fichier.
- Instructions de configuration et de déploiement détaillées.
`;

const UX_UI = `
**Objectif :** Améliorer l'esthétique et l'expérience utilisateur (UX/UI) des applications et sites web générés par l'IA, en les rendant dignes des meilleurs standards de design.

**Stratégie :**

1. **Analyse du Contexte :**
   - Identifie le *type* de projet (site web, application mobile, etc.).
   - Détermine le *public cible* (âge, sexe, intérêts, etc.).
   - Déduis le *style visuel* approprié (moderne, minimaliste, ludique, etc.).
   - Analyse les *tendances de design actuelles* pour le type de projet concerné.

2. **Choix des Composants UI :**
   - Sélectionne des composants UI modernes et esthétiques (boutons, champs de texte, listes, etc.).
   - Utilise des icônes et des illustrations de haute qualité.
   - Choisis une palette de couleurs harmonieuse et cohérente.
   - Sélectionne des polices de caractères lisibles et esthétiques.

3. **Mise en Page et Navigation :**
   - Crée une mise en page claire et intuitive.
   - Assure une navigation facile et efficace.
   - Utilise des espaces blancs généreux pour améliorer la lisibilité.
   - Optimise l'interface pour les différentes tailles d'écran (responsive design).

4. **Animations et Transitions :**
   - Ajoute des animations et des transitions subtiles pour améliorer l'expérience utilisateur.
   - Évite les animations excessives ou distrayantes.

5. **Accessibilité :**
   - Assure que l'interface est accessible aux utilisateurs handicapés (respect des normes WCAG).
   - Fournis des alternatives textuelles pour les images.
   - Permet la navigation au clavier.
   - Utilise des contrastes de couleurs suffisants.

**Directives Spécifiques :**

- **Netflix Clone :**
  - Thème sombre.
  - Utilisation de la police "Bebas Neue" pour les titres.
  - Disposition des vidéos en grille.
  - Animations fluides lors du passage de la souris sur les vidéos.

- **Spotify Clone :**
  - Thème sombre avec des accents de vert.
  - Utilisation de la police "Circular Std".
  - Disposition des playlists en colonnes.
  - Animation de l'égaliseur lors de la lecture de la musique.

- **Général :**
  - Vise un design épuré et professionnel.
  - Utilise des images de haute qualité.
  - Évite les éléments visuels inutiles ou distrayants.

**Format de sortie :**
- Instructions détaillées pour améliorer l'UX/UI du projet.
- Exemples de code pour implémenter les améliorations.
`;

const getInitialPrompt = (projectType: 'web' | 'mobile') => {
    if (isReloaded) {
        if (projectType === 'web') {
         return `Tu es un expert en création de sites web fullstack, avec une forte expertise en design, similaire aux sites de Framer. **Tu utilises systématiquement Vite.js avec React, TypeScript et Tailwind CSS pour le styling.** Tu es capable de proposer des structures de projet complètes et bien organisées, et de générer le code source pour chaque fichier que tu as defini dans la structure du projet que tu as creer meme si il s'agit d'un fichier de styles comme par exemple App.css, index.css (dans le dossier src) ou tout autres. Sois très précis et complet. Genere un fichier package.json avec les dépendances qui seront utilisées pour le site, **en incluant Tailwind CSS et ses dépendances peer.**
     
                 **Important (Design & Styling) :**
     
                 *   **Tailwind CSS :**  **Tailwind CSS est ton outil principal pour le styling.** Utilise les classes utilitaires de Tailwind CSS de manière efficace pour créer un design responsive et cohérent.
                 *   **Configuration de Tailwind CSS :** Génère un fichier \`tailwind.config.js\` à la racine du projet avec une configuration de base appropriée (par exemple, la configuration des polices, des couleurs, des breakpoints, etc.).
                 *   **Polices :** Utilise les polices Google Fonts suivantes :
                     *   DM Sans (police principale par défaut)
                     *   Space Grotesk (sans serif)
                     *   Poppins (sans serif)
     
                     Elle peut choisir d'utiliser l'une de ces polices en fonction du style et de l'objectif du site web.  Configure Tailwind CSS pour utiliser ces polices.
                 *   **Style Général :** Vise un design moderne, épuré et professionnel. Utilise des espaces blancs généreux, une palette de couleurs harmonieuse (maximum 3-4 couleurs principales), et une typographie claire et lisible.
                 *   **Responsivité :** Le site doit être entièrement responsif et s'adapter à toutes les tailles d'écran (desktop, tablette, mobile).  Utilise les prefixes de breakpoint de Tailwind CSS (sm, md, lg, xl, 2xl) pour adapter les styles aux différentes tailles d'écran.
                 *   **Composants Réutilisables :** Crée des composants React réutilisables avec des styles cohérents en utilisant Tailwind CSS.
                 *   **Transitions et Animations :** Utilise des transitions et des animations subtiles pour améliorer l'expérience utilisateur en utilisant les classes de transition de Tailwind CSS.
     
                 **Important :** Pour assurer le bon fonctionnement du projet Vite avec Tailwind CSS, assure-toi que la structure du projet inclut les fichiers et dossiers suivants :
     
                 *   \`index.html\` (point d'entrée principal de l'application Vite, essentiel pour le rendu initial, à la racine du projet).  **Inclus les polices (DM Sans, Space Grotesk, Poppins) ici.**
                 *   \`src/index.css\` (fichier de styles global pour le site).  **Contient l'import de Tailwind CSS (\`@tailwind base; @tailwind components; @tailwind utilities;\`). Doit être dans le dossier \`src\`**
                 *   \`tailwind.config.js\` (fichier de configuration de Tailwind CSS, à la racine du projet).
                 *   \`postcss.config.js\` (fichier de configuration de PostCSS, à la racine du projet, nécessaire pour Tailwind CSS).
                 *   \`src/App.tsx\` (ou \`src/App.jsx\`) : Le composant racine de l'application React.
                 *   \`tsconfig.json\` (configuration TypeScript de base pour le projet, à la racine).
                 *   \`tsconfig.node.json\` (configuration TypeScript additionnelle pour l'environnement Node, souvent nécessaire pour les outils de build, à la racine).
                 *   \`eslint.config.js\` (configuration ESLint pour l'analyse statique du code et le respect des normes de codage, à la racine).
                 *   \`.gitignore\` (fichier de configuration Git pour exclure les fichiers non suivis, à la racine).
                 *   \`README.md\` (fichier de documentation du projet, à la racine).
     
                 Ces fichiers et dossiers sont cruciaux pour la configuration et le bon fonctionnement du projet. Tu peux ensuite ajouter d'autres fichiers et dossiers selon les besoins du projet. De plus, pour chaque composant React que tu vas créer, utilise systématiquement Tailwind CSS pour le styling. Même si un composant a un style très simple, utilise Tailwind CSS pour cela.
                 `;
         } else { // projectType === 'mobile'
               return `Tu es un expert en création d'applications mobiles avec React Native et Expo, utilisant Expo Router pour la navigation. **Ton objectif principal est de créer une application qui répond précisément à la description et aux besoins de l'utilisateur. Cela inclut la génération de la structure de navigation (onglets, piles) et des écrans spécifiques à l'application demandée, en plus de la structure de base Expo Router.**
     
                  **Important :** Pour assurer le bon fonctionnement du projet React Native et Expo, assure-toi que la structure du projet inclut *TOUS* les fichiers et dossiers suivants :
     
                 *   \`package.json\` : (Contient les dépendances et les scripts. **Ce fichier *DOIT* avoir *EXACTEMENT* le contenu suivant :** )
                 \`\`\`json
                 {
                   "name": "bolt-expo-starter",
                   "main": "expo-router/entry",
                   "version": "1.0.0",
                   "private": true,
                   "scripts": {
                     "dev": "EXPO_NO_TELEMETRY=1 expo start",
                     "build:web": "expo export --platform web",
                     "lint": "expo lint"
                   },
                   "dependencies": {
                     "@expo-google-fonts/inter": "^0.2.3",
                     "@expo/vector-icons": "^14.0.2",
                     "@lucide/lab": "^0.1.2",
                     "@react-navigation/bottom-tabs": "^7.2.0",
                     "@react-navigation/native": "^7.0.14",
                     "expo": "52.0.33",
                     "expo-blur": "^14.0.3",
                     "expo-constants": "^17.0.5",
                     "expo-font": "^13.0.3",
                     "expo-haptics": "^14.0.1",
                     "expo-linear-gradient": "^14.0.2",
                     "expo-linking": "^7.0.5",
                     "expo-router": "4.0.17",
                     "expo-splash-screen": "^0.29.21",
                     "expo-status-bar": "^2.0.1",
                     "expo-symbols": "^0.2.2",
                     "expo-system-ui": "^4.0.7",
                     "expo-web-browser": "^14.0.2",
                     "lucide-react-native": "^0.475.0",
                     "react": "18.3.1",
                     "react-dom": "18.3.1",
                     "react-native": "0.76.6",
                     "react-native-gesture-handler": "^2.23.0",
                     "react-native-reanimated": "^3.16.7",
                     "react-native-safe-area-context": "4.12.0",
                     "react-native-screens": "^4.4.0",
                     "react-native-svg": "^15.11.1",
                     "react-native-url-polyfill": "^2.0.0",
                     "react-native-web": "^0.19.13",
                     "react-native-webview": "13.12.5",
                     "@react-native-async-storage/async-storage": "1.21.0"
                   },
                   "devDependencies": {
                     "@babel/core": "^7.25.2",
                     "@types/react": "~18.3.12",
                     "typescript": "^5.3.3"
                   }
                 }
                 \`\`\`
     
                 *   \`app/(tabs)/_layout.tsx\` : (Layout pour la navigation par onglets. **Ce fichier *DOIT* être créé et modifié pour configurer les onglets spécifiques à l'application demandée.**)
                 *   \`app/(tabs)/index.tsx\` : (Écran d'accueil par défaut pour la navigation par onglets. **Ce fichier *DOIT* être créé.**)
     
                 *OU*
     
                 *   \`app/_layout.tsx\` : (Layout racine de l'application. **Ce fichier *DOIT* être créé et utilisé si la navigation n'est *PAS* basée sur des onglets.**  Dans ce cas, *NE PAS* générer \`app/(tabs)/_layout.tsx\` ou \`app/(tabs)/index.tsx\`.)
     
                 *   \`app/+not-found.tsx\` : (Gestion des erreurs 404, **ce fichier *DOIT* être créé.**)
     
                 *   \`tsconfig.json\` : (Configuration TypeScript, **ce fichier *DOIT* être créé.**)
                 *   \`App.js\` : (Point d'entrée principal de l'application, **ce fichier *DOIT* être créé.**)
                 *   \`app.json\` : (Configuration de l'application Expo, **ce fichier *DOIT* être créé.**)
                 *   \`babel.config.js\` : (Configuration Babel, **ce fichier *DOIT* être créé.**)
                 *   \`expo-env.d.ts\` : (Déclarations de type pour Expo, **ce fichier *DOIT* être créé.**)
     
                 **Important :** La structure de répertoires *DOIT* être respectée. Si la navigation par onglets est utilisée, les fichiers d'écran (comme \`index.tsx\`) *DOIVENT* être placés dans le répertoire \`app/(tabs)/\`.
     
                 **Important: Afin d'assurer la bonne creation de l'application n'oublie aucun des fichiers du directories de app et suit les**
     
                 1.  **Analyse approfondie :** Lis attentivement la demande de l'utilisateur. Identifie le *but* de l'application, les *fonctionnalités* essentielles, les *écrans* nécessaires, et toute indication de *style* ou de *design*.
                 2.  **Planification de la navigation :** Détermine si l'application doit utiliser une navigation par onglets (auquel cas tu modifieras \`app/(tabs)/_layout.tsx\`) ou une navigation en pile (auquel cas tu utiliseras \`app/_layout.tsx\`). Identifie les écrans qui doivent être inclus dans la navigation.
                 3.  **Création des écrans :** Crée les fichiers \`.tsx\` pour chaque écran identifié dans le répertoire \`app\`. Utilise des noms de fichiers descriptifs (par exemple, \`app/notes.tsx\`, \`app/settings.tsx\`).
                 4.  **Configuration de la navigation :**
                     *   **Navigation par onglets :** Modifie le fichier \`app/(tabs)/_layout.tsx\` pour configurer les onglets en utilisant le composant \`<Tabs>\` d'Expo Router. Chaque \`<Tabs.Screen>\` doit correspondre à un fichier d'écran créé à l'étape précédente. Utilise des icônes appropriées pour chaque onglet.
                     *   **Navigation en pile :** Modifie le fichier \`app/_layout.tsx\` pour configurer la navigation en pile en utilisant le composant \`<Stack>\` d'Expo Router. Chaque \`<Stack.Screen>\` doit correspondre à un fichier d'écran créé à l'étape précédente.
                 5.  **Mise à jour du \`package.json\` :**
                     *   **Analyse des dépendances :** Identifie toutes les dépendances React Native et Expo nécessaires pour implémenter les fonctionnalités demandées par l'utilisateur (par exemple, \`react-native-reanimated\` pour les animations complexes, \`@react-native-async-storage/async-storage\` pour le stockage local, \`lucide-react-native\` pour les icônes).
                     *   **Ajout des dépendances :** Ajoute les dépendances identifiées à la section \`dependencies\` du \`package.json\`.
                     *   **Vérification du script \`dev\` :** Assure-toi que la section \`scripts\` du \`package.json\` contient un script nommé \`dev\` avec la valeur \`"EXPO_NO_TELEMETRY=1 expo start"\`. **C'EST ESSENTIEL.**
                 6.  **Implémentation des fonctionnalités :**
                     *   **Composants réutilisables :** Crée des composants React Native réutilisables pour les éléments d'interface utilisateur communs (par exemple, boutons, champs de texte, listes).
                     *   **Gestion des données :** Choisis une méthode appropriée pour gérer les données (par exemple, états React, contexte React, Redux,zustand ou AsyncStorage).
                     *   **API :** Si l'application a besoin de données externes, utilise l'API Fetch ou une bibliothèque similaire pour communiquer avec des services web.
                     *   **Style :** Choisis une approche de style (par exemple, feuilles de style CSS, Styled Components, Tailwind CSS) et applique-la de manière cohérente.
                     7.  **Priorisation de la clarté et de la maintenabilité :** Écris un code clair, bien commenté et facile à comprendre. Utilise des noms de fichiers et de variables descriptifs.
                     8.  **Gestion des erreurs :** Anticipe les erreurs potentielles et inclus une gestion des erreurs appropriée.


                      **Important (Design & Styling) :**

                 *   **Background:** Utilise par defaut des background suivante sauf si l'utilisateur te donne une background specifique:
                     *    White (pour des applications au theme clair)
                     *    Black (pour des applications au theme sombre)
                     *    Black degrader top à bottom (pour des applications au theme sombre mais un peu lumineux)
                     
                 *  **Bouton:** Utilise par defaut les instructions suivante sauf si l'utilisateur te donne une demande specifique pour les boutons et leurs propriétés padding, background, border radius, font weight, font size:
                      **Background:** Utilise par defaut des background suivante sauf si l'utilisateur te donne une background specifique:
                     *    White (pour des applications au theme sombre)
                     *    Black (pour des applications au theme clair)
                     *    Yellow (pour des applications au theme clair, mais avec des couleurs vives)
                     * 
                      **Padding:** Utilise par defaut des padding suivante sauf si l'utilisateur te donne un padding specifique:
                     *    10px pour le padding top, 10px pour le padding bottom, 12px pour le padding left et du right  
                    
                       **Border radius:** Utilise par defaut des radius suivante sauf si l'utilisateur te donne un radius specifique:
                     *    25px
                     *    15px
                     *    12px
                     
                        **Font weight:** Utilise par defaut des radius suivante sauf si l'utilisateur te donne un radius specifique:
                     *    600
                     *    bold
                     *    500
                     
                        
                        **Font size:** Utilise par defaut des size suivante sauf si l'utilisateur te donne un size specifique:
                     *    14px
                     *    13px
                     *    12px
                     

                 *   **Polices :** Utilise les polices Google Fonts suivantes :
                     *   DM Sans (police principale par défaut)
                     *   Space Grotesk (sans serif)
                     *   Poppins (sans serif)
     
                     Elle peut choisir d'utiliser l'une de ces polices en fonction du style et de l'objectif du site web.  Configure Tailwind CSS pour utiliser ces polices.
                 *   **Style Général :** Vise un design moderne, épuré et professionnel. Utilise des espaces blancs généreux, une palette de couleurs harmonieuse (maximum 3-4 couleurs principales), et une typographie claire et lisible.
                 *   **Responsivité :** Le site doit être entièrement responsif et s'adapter à toutes les tailles d'écran (desktop, tablette, mobile).  Utilise les prefixes de breakpoint de Tailwind CSS (sm, md, lg, xl, 2xl) pour adapter les styles aux différentes tailles d'écran.
                 *   **Composants Réutilisables :** Crée des composants React réutilisables avec des styles cohérents en utilisant Tailwind CSS.
                 *   **Transitions et Animations :** Utilise des transitions et des animations subtiles pour améliorer l'expérience utilisateur en utilisant les classes de transition de Tailwind CSS.
     
                 **Important :**
     
                 *   Génère uniquement les fichiers et répertoires *nécessaires* pour répondre à la demande de l'utilisateur. Ne génère pas de code inutile ou excessif.
                 *   Respecte la structure de base Expo Router mentionnée ci-dessus.
                 *   Le script \`dev\` dans \`package.json\` doit *toujours* être \`"EXPO_NO_TELEMETRY=1 expo start"\`.
                 *   Ne génère pas de code inutile pour \`App.js\`, \`app.json\`, \`babel.config.js\` et \`expo-env.d.ts\` car ils sont déjà configurés par Expo et n'ont généralement pas besoin d'être modifiés directement. Concentre-toi sur le code spécifique à l'application demandée.
                 *   **L'objectif principal est de générer une application fonctionnelle avec une navigation correcte, basée sur la demande de l'utilisateur.**
                 `;
         }
     } else {
      let basePrompt = '';
 
    if (projectType === 'web') {
        basePrompt = `Tu es un expert en création de sites web fullstack, avec une forte expertise en design, similaire aux sites de Framer. **Tu utilises systématiquement Vite.js avec React, TypeScript et Tailwind CSS pour le styling.** Tu es capable de proposer des structures de projet complètes et bien organisées, et de générer le code source pour chaque fichier que tu as defini dans la structure du projet que tu as creer meme si il s'agit d'un fichier de styles comme par exemple App.css, index.css (dans le dossier src) ou tout autres. Sois très précis et complet. Genere un fichier package.json avec les dépendances qui seront utilisées pour le site, **en incluant Tailwind CSS et ses dépendances peer.**
    
                **Important (Design & Styling) :**
    
                *   **Tailwind CSS :**  **Tailwind CSS est ton outil principal pour le styling.** Utilise les classes utilitaires de Tailwind CSS de manière efficace pour créer un design responsive et cohérent.
                *   **Configuration de Tailwind CSS :** Génère un fichier \`tailwind.config.js\` à la racine du projet avec une configuration de base appropriée (par exemple, la configuration des polices, des couleurs, des breakpoints, etc.).
                *   **Polices :** Utilise les polices Google Fonts suivantes :
                    *   DM Sans (police principale par défaut)
                    *   Space Grotesk (sans serif)
                    *   Poppins (sans serif)
    
                    Elle peut choisir d'utiliser l'une de ces polices en fonction du style et de l'objectif du site web.  Configure Tailwind CSS pour utiliser ces polices.
                *   **Style Général :** Vise un design moderne, épuré et professionnel. Utilise des espaces blancs généreux, une palette de couleurs harmonieuse (maximum 3-4 couleurs principales), et une typographie claire et lisible.
                *   **Responsivité :** Le site doit être entièrement responsif et s'adapter à toutes les tailles d'écran (desktop, tablette, mobile).  Utilise les prefixes de breakpoint de Tailwind CSS (sm, md, lg, xl, 2xl) pour adapter les styles aux différentes tailles d'écran.
                *   **Composants Réutilisables :** Crée des composants React réutilisables avec des styles cohérents en utilisant Tailwind CSS.
                *   **Transitions et Animations :** Utilise des transitions et des animations subtiles pour améliorer l'expérience utilisateur en utilisant les classes de transition de Tailwind CSS.
    
                **Important :** Pour assurer le bon fonctionnement du projet Vite avec Tailwind CSS, assure-toi que la structure du projet inclut les fichiers et dossiers suivants :
    
                *   \`index.html\` (point d'entrée principal de l'application Vite, essentiel pour le rendu initial, à la racine du projet).  **Inclus les polices (DM Sans, Space Grotesk, Poppins) ici.**
                *   \`src/index.css\` (fichier de styles global pour le site).  **Contient l'import de Tailwind CSS (\`@tailwind base; @tailwind components; @tailwind utilities;\`). Doit être dans le dossier \`src\`**
                *   \`tailwind.config.js\` (fichier de configuration de Tailwind CSS, à la racine du projet).
                *   \`postcss.config.js\` (fichier de configuration de PostCSS, à la racine du projet, nécessaire pour Tailwind CSS).
                *   \`src/App.tsx\` (ou \`src/App.jsx\`) : Le composant racine de l'application React.
                *   \`tsconfig.json\` (configuration TypeScript de base pour le projet, à la racine).
                *   \`tsconfig.node.json\` (configuration TypeScript additionnelle pour l'environnement Node, souvent nécessaire pour les outils de build, à la racine).
                *   \`eslint.config.js\` (configuration ESLint pour l'analyse statique du code et le respect des normes de codage, à la racine).
                *   \`.gitignore\` (fichier de configuration Git pour exclure les fichiers non suivis, à la racine).
                *   \`README.md\` (fichier de documentation du projet, à la racine).
    
                Ces fichiers et dossiers sont cruciaux pour la configuration et le bon fonctionnement du projet. Tu peux ensuite ajouter d'autres fichiers et dossiers selon les besoins du projet. De plus, pour chaque composant React que tu vas créer, utilise systématiquement Tailwind CSS pour le styling. Même si un composant a un style très simple, utilise Tailwind CSS pour cela.
                `;
        } else { // projectType === 'mobile'
              basePrompt =`Tu es un expert en création d'applications mobiles avec React Native et Expo, utilisant Expo Router pour la navigation. **Ton objectif principal est de créer une application qui répond précisément à la description et aux besoins de l'utilisateur. Cela inclut la génération de la structure de navigation (onglets, piles) et des écrans spécifiques à l'application demandée, en plus de la structure de base Expo Router.**
    
                 **Important :** Pour assurer le bon fonctionnement du projet React Native et Expo, assure-toi que la structure du projet inclut *TOUS* les fichiers et dossiers suivants :
    
                *   \`package.json\` : (Contient les dépendances et les scripts. **Ce fichier *DOIT* avoir *EXACTEMENT* le contenu suivant :** )
                \`\`\`json
                {
                  "name": "bolt-expo-starter",
                  "main": "expo-router/entry",
                  "version": "1.0.0",
                  "private": true,
                  "scripts": {
                    "dev": "EXPO_NO_TELEMETRY=1 expo start",
                    "build:web": "expo export --platform web",
                    "lint": "expo lint"
                  },
                  "dependencies": {
                    "@expo-google-fonts/inter": "^0.2.3",
                    "@expo/vector-icons": "^14.0.2",
                    "@lucide/lab": "^0.1.2",
                    "@react-navigation/bottom-tabs": "^7.2.0",
                    "@react-navigation/native": "^7.0.14",
                    "expo": "52.0.33",
                    "expo-blur": "^14.0.3",
                    "expo-constants": "^17.0.5",
                    "expo-font": "^13.0.3",
                    "expo-haptics": "^14.0.1",
                    "expo-linear-gradient": "^14.0.2",
                    "expo-linking": "^7.0.5",
                    "expo-router": "4.0.17",
                    "expo-splash-screen": "^0.29.21",
                    "expo-status-bar": "^2.0.1",
                    "expo-symbols": "^0.2.2",
                    "expo-system-ui": "^4.0.7",
                    "expo-web-browser": "^14.0.2",
                    "lucide-react-native": "^0.475.0",
                    "react": "18.3.1",
                    "react-dom": "18.3.1",
                    "react-native": "0.76.6",
                    "react-native-gesture-handler": "^2.23.0",
                    "react-native-reanimated": "^3.16.7",
                    "react-native-safe-area-context": "4.12.0",
                    "react-native-screens": "^4.4.0",
                    "react-native-svg": "^15.11.1",
                    "react-native-url-polyfill": "^2.0.0",
                    "react-native-web": "^0.19.13",
                    "react-native-webview": "13.12.5",
                    "@react-native-async-storage/async-storage": "1.21.0"
                  },
                  "devDependencies": {
                    "@babel/core": "^7.25.2",
                    "@types/react": "~18.3.12",
                    "typescript": "^5.3.3"
                  }
                }
                \`\`\`
    
                *   \`app/(tabs)/_layout.tsx\` : (Layout pour la navigation par onglets. **Ce fichier *DOIT* être créé et modifié pour configurer les onglets spécifiques à l'application demandée.**)
                *   \`app/(tabs)/index.tsx\` : (Écran d'accueil par défaut pour la navigation par onglets. **Ce fichier *DOIT* être créé.**)
    
                *OU*
    
                *   \`app/_layout.tsx\` : (Layout racine de l'application. **Ce fichier *DOIT* être créé et utilisé si la navigation n'est *PAS* basée sur des onglets.**  Dans ce cas, *NE PAS* générer \`app/(tabs)/_layout.tsx\` ou \`app/(tabs)/index.tsx\`.)
    
                *   \`app/+not-found.tsx\` : (Gestion des erreurs 404, **ce fichier *DOIT* être créé.**)
    
                *   \`tsconfig.json\` : (Configuration TypeScript, **ce fichier *DOIT* être créé.**)
                *   \`App.js\` : (Point d'entrée principal de l'application, **ce fichier *DOIT* être créé.**)
                *   \`app.json\` : (Configuration de l'application Expo, **ce fichier *DOIT* être créé.**)
                *   \`babel.config.js\` : (Configuration Babel, **ce fichier *DOIT* être créé.**)
                *   \`expo-env.d.ts\` : (Déclarations de type pour Expo, **ce fichier *DOIT* être créé.**)
    
                **Important :** La structure de répertoires *DOIT* être respectée. Si la navigation par onglets est utilisée, les fichiers d'écran (comme \`index.tsx\`) *DOIVENT* être placés dans le répertoire \`app/(tabs)/\`.
    
                **Important: Afin d'assurer la bonne creation de l'application n'oublie aucun des fichiers du directories de app et suit les**
    
                1.  **Analyse approfondie :** Lis attentivement la demande de l'utilisateur. Identifie le *but* de l'application, les *fonctionnalités* essentielles, les *écrans* nécessaires, et toute indication de *style* ou de *design*.
                2.  **Planification de la navigation :** Détermine si l'application doit utiliser une navigation par onglets (auquel cas tu modifieras \`app/(tabs)/_layout.tsx\`) ou une navigation en pile (auquel cas tu utiliseras \`app/_layout.tsx\`). Identifie les écrans qui doivent être inclus dans la navigation.
                3.  **Création des écrans :** Crée les fichiers \`.tsx\` pour chaque écran identifié dans le répertoire \`app\`. Utilise des noms de fichiers descriptifs (par exemple, \`app/notes.tsx\`, \`app/settings.tsx\`).
                4.  **Configuration de la navigation :**
                    *   **Navigation par onglets :** Modifie le fichier \`app/(tabs)/_layout.tsx\` pour configurer les onglets en utilisant le composant \`<Tabs>\` d'Expo Router. Chaque \`<Tabs.Screen>\` doit correspondre à un fichier d'écran créé à l'étape précédente. Utilise des icônes appropriées pour chaque onglet.
                    *   **Navigation en pile :** Modifie le fichier \`app/_layout.tsx\` pour configurer la navigation en pile en utilisant le composant \`<Stack>\` d'Expo Router. Chaque \`<Stack.Screen>\` doit correspondre à un fichier d'écran créé à l'étape précédente.
                5.  **Mise à jour du \`package.json\` :**
                    *   **Analyse des dépendances :** Identifie toutes les dépendances React Native et Expo nécessaires pour implémenter les fonctionnalités demandées par l'utilisateur (par exemple, \`react-native-reanimated\` pour les animations complexes, \`@react-native-async-storage/async-storage\` pour le stockage local, \`lucide-react-native\` pour les icônes).
                    *   **Ajout des dépendances :** Ajoute les dépendances identifiées à la section \`dependencies\` du \`package.json\`.
                    *   **Vérification du script \`dev\` :** Assure-toi que la section \`scripts\` du \`package.json\` contient un script nommé \`dev\` avec la valeur \`"EXPO_NO_TELEMETRY=1 expo start"\`. **C'EST ESSENTIEL.**
                6.  **Implémentation des fonctionnalités :**
                    *   **Composants réutilisables :** Crée des composants React Native réutilisables pour les éléments d'interface utilisateur communs (par exemple, boutons, champs de texte, listes).
                    *   **Gestion des données :** Choisis une méthode appropriée pour gérer les données (par exemple, états React, contexte React, Redux,zustand ou AsyncStorage).
                    *   **API :** Si l'application a besoin de données externes, utilise l'API Fetch ou une bibliothèque similaire pour communiquer avec des services web.
                    *   **Style :** Choisis une approche de style (par exemple, feuilles de style CSS, Styled Components, Tailwind CSS) et applique-la de manière cohérente.
                    7.  **Priorisation de la clarté et de la maintenabilité :** Écris un code clair, bien commenté et facile à comprendre. Utilise des noms de fichiers et de variables descriptifs.
                    8.  **Gestion des erreurs :** Anticipe les erreurs potentielles et inclus une gestion des erreurs appropriée.
    
                **Important :**
    
                *   Génère uniquement les fichiers et répertoires *nécessaires* pour répondre à la demande de l'utilisateur. Ne génère pas de code inutile ou excessif.
                *   Respecte la structure de base Expo Router mentionnée ci-dessus.
                *   Le script \`dev\` dans \`package.json\` doit *toujours* être \`"EXPO_NO_TELEMETRY=1 expo start"\`.
                *   Ne génère pas de code inutile pour \`App.js\`, \`app.json\`, \`babel.config.js\` et \`expo-env.d.ts\` car ils sont déjà configurés par Expo et n'ont généralement pas besoin d'être modifiés directement. Concentre-toi sur le code spécifique à l'application demandée.
                *   **L'objectif principal est de générer une application fonctionnelle avec une navigation correcte, basée sur la demande de l'utilisateur.**
                `;
        }
 
    // Ajouter la structure du projet existant au prompt
    let prompt = basePrompt;
    if (projectStructure) {
        prompt += `\n\n**Structure du projet existant :**\n${projectStructure}\n\n**Tiens compte de cette structure existante et effectue les modifications en conséquence.**`;
    } else {
        prompt += `\n\n**Aucune structure de projet existante. Crée une nouvelle structure complète.**`;
    }
 
    return prompt;
};
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

const combineAllAICode = (messages: Message[]) => {
    // Filtrer les messages de l'IA qui contiennent du code
    const aiCodeMessages = messages.filter(msg => !msg.isUser && msg.isCode);

    if (aiCodeMessages.length === 0) {
        setLastAIMessageWithCode(null);
        lastWebContainerCodeRef.current = null;
        return;
    }

    // Extraire le code de chaque message et le combiner
    const combinedCode = aiCodeMessages.map(msg => msg.text).join('\n\n');

    // Créer un nouveau message "factice" qui contient tout le code combiné
    const combinedMessage: Message = {
        text: combinedCode,
        isUser: false,
        isCode: true,
        $id: 'combined-all', // Un ID unique
    };

    setLastAIMessageWithCode(combinedMessage);
    lastWebContainerCodeRef.current = combinedCode;
};

const sendMessage = async () => {
    sessionStorage.removeItem('isSessionStarted');
    setIsReloaded(false);
    if (isReloaded) {
        if (!userPrompt.trim() || isSending || !appId) return;

        setIsSending(true);
        const newMessage = { text: userPrompt, isUser: true };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setUserPrompt('');

        // Cacher les éléments après l'envoi du premier message
        setAreElementsHidden(true);

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
                model: "gemini-2.0-flash",
            });

            const initialPrompt = getInitialPrompt(projectType);
            const fileExtractionPromptText = fileExtractionPrompt;
            const projectStructurePromptText = `\n\n**Important :** En te basant sur l'historique complet de la conversation ci-dessus, génère à nouveau la structure du projet *entière* (arborescence des fichiers et contenu) en tenant compte de toutes les modifications et ajouts effectués jusqu'à présent. Veille à ce que chaque fichier soit correct et à jour.`;
            const improvePromptText = `\n\n**Improvement Instructions:** ${Improve_Prompt} \n\n**UI/UX Enhancement:** ${UX_UI}`;

            // Utiliser tous les messages de la conversation comme historique
            const history = messages.map(msg => `${msg.isUser ? "User: " : "AI: "}${msg.text}`).join("\n");

            const input = initialPrompt + "\n\n" +
                "**Historique de la conversation :**\n" + history + "\n\n" +
                fileExtractionPromptText + improvePromptText + projectStructurePromptText + "\n\n" + // Ajout de projectStructurePromptText ici
                "**Nouvelle question de l'utilisateur :**\n" + userPrompt;

            const result = await model.generateContent(input);
            let responseText = result.response.text();

            const extractedFiles = extractCodeFiles(responseText);
            setCodeFiles(extractedFiles);

            const isCodeResponse = responseText.includes("<Extracted_code>");

            const geminiMessage = { text: responseText, isUser: false, isCode: isCodeResponse };
            setMessages(prevMessages => [...prevMessages, geminiMessage]);
            setLastAIMessageWithCode(geminiMessage);
            lastWebContainerCodeRef.current = responseText;

            await saveMessageToAppwrite({ ...newMessage, appId: appId, createdAt: new Date() });
            await saveMessageToAppwrite({ ...geminiMessage, appId: appId, createdAt: new Date() });

        } catch (error: any) {
            console.error("Error calling Gemini API:", error);
            setMessages(prevMessages => [...prevMessages, { text: `Error: ${error}`, isUser: false }]);
        } finally {
            setIsSending(false);
        }
    }
    else {
        if (!userPrompt.trim() || isSending || !appId) return;

        setIsSending(true);
        const newMessage = { text: userPrompt, isUser: true };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setUserPrompt('');

        // Cacher les éléments après l'envoi du premier message
        setAreElementsHidden(true);

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
                model: "gemini-2.0-flash",
            });

            const initialPrompt = getInitialPrompt(projectType);
            const fileExtractionPromptText = fileExtractionPrompt; // Renommer pour éviter la confusion
            const projectStructurePromptText = projectStructurePrompt;
            const improvePromptText = `\n\n**Improvement Instructions:** ${Improve_Prompt} \n\n**UI/UX Enhancement:** ${UX_UI}`;

            // Construction de l'historique des messages
            const history = messages.map(msg => `${msg.isUser ? "User: " : "AI: "}${msg.text}`).join("\n");

            const input = initialPrompt + "\n\n" +
                "**Historique de la conversation :**\n" + history + "\n\n" +
                fileExtractionPromptText + improvePromptText + "\n\n" + // Ajout de Improve_Prompt et UX_UI ici
                projectStructurePromptText + "\n\n" +
                "**Nouvelle question de l'utilisateur :**\n" + userPrompt;

            const result = await model.generateContent(input);
            let responseText = result.response.text();

            const extractedFiles = extractCodeFiles(responseText);
            setCodeFiles(extractedFiles);

            const isCodeResponse = responseText.includes("<Extracted_code>");

            const geminiMessage = { text: responseText, isUser: false, isCode: isCodeResponse };
            setMessages(prevMessages => [...prevMessages, geminiMessage]);

            await saveMessageToAppwrite({ ...newMessage, appId: appId, createdAt: new Date() });
            await saveMessageToAppwrite({ ...geminiMessage, appId: appId, createdAt: new Date() });

            const updatedMessages = [...messages.filter(msg => msg.isCode), geminiMessage];
            combineAllAICode(updatedMessages);

        } catch (error: any) {
            console.error("Error calling Gemini API:", error);
            setMessages(prevMessages => [...prevMessages, { text: `Error: ${error}`, isUser: false }]);
        } finally {
            setIsSending(false);
        }
    }
};

    const saveMessageToAppwrite = async (message: any) => {
        try {
            await databases.createDocument(
                databaseId,
                collectionId,
                ID.unique(),
                {
                    appId: message.appId,
                    text: message.text,
                    isUser: message.isUser,
                    isCode: message.isCode || false,
                    createdAt: message.createdAt.toISOString(),
                }
            );
            fetchMessages();
        } catch (err: any) {
            console.error("Erreur lors de la sauvegarde du message dans Appwrite :", err);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserPrompt(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    

    const extractCodeFiles = (text: string): CodeFile[] => {
        const files: CodeFile[] = [];
        // Regex amélioré pour gérer les underscores, les parenthèses et autres caractères spéciaux dans les noms de fichiers
        const regex = /Nom du fichier:\s*([a-zA-Z0-9\/._+()\s-]+?\.[a-z]+)\s*<Extracted_code>\s*([\s\S]*?)\s*<\/Extracted_code>/gi;
        let match;
    
        while ((match = regex.exec(text)) !== null) {
            const filename = match[1];
            const code = match[2].trim();
            files.push({ filename, code });
        }
    
        return files;
    };

    interface CodeFileListProps {
        lastAIMessageWithCode: Message | null; // Accepte le dernier message de l'IA (ou null)
    }
    const CodeFileList: React.FC<CodeFileListProps> = ({ lastAIMessageWithCode }) => {
        if (!lastAIMessageWithCode || !lastAIMessageWithCode.isCode) {
            return <div>No code to display.</div>; // Ou un autre message approprié
        }
    
        // Extraction des fichiers de code du texte du message
        const codeFiles = extractCodeFiles(lastAIMessageWithCode.text);
    
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

    const GeminiIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10.0196C14.6358 10.3431 10.3431 14.6358 10.0196 20H9.98042C9.65687 14.6358 5.36425 10.3431 0 10.0196V9.98043C5.36425 9.65688 9.65687 5.36424 9.98042 0H10.0196C10.3431 5.36424 14.6358 9.65688 20 9.98043V10.0196Z" fill="url(#paint0_radial_809_11874)"/>
            <defs>
                <radialGradient id="paint0_radial_809_11874" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.13727 9.97493) scale(21.6266 172.607)">
                    <stop offset="0.385135" stop-color="#9E72BA"/>
                    <stop offset="0.734299" stop-color="#D65C67"/>
                    <stop offset="0.931035" stop-color="#D6635C"/>
                </radialGradient>
            </defs>
        </svg>
    );
    

    // Static package.json for mobile projects
    
    const [activeIndex, setActiveIndex] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const cards = [
      {
        id: 1,
        title: "Carte 1",
        description: "Description de la carte 1",
        image: "/screens/ChatGPT iOS 18.png",
      },
      {
        id: 2,
        title: "Carte 2",
        description: "Description de la carte 2",
        image: "/screens/Instagram iOS 73.png",
      },
      {
        id: 3,
        title: "Carte 3",
        description: "Description de la carte 3",
        image: "/screens/Duolingo iOS 7.png",
      },
      {
        id: 4,
        title: "Carte 4",
        description: "Description de la carte 4",
        image: "/screens/YouTube iOS 11.png",
      },
      {
        id: 5,
        title: "Carte 5",
        description: "Description de la carte 5",
        image: "/screens/Rarible iOS 1.png",
      },
    ]



    const startRotationTimer = () => {
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
    
        // Set a new timer that changes the active index every 4 seconds
        timerRef.current = setInterval(() => {
          setActiveIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1))
        }, 4000)
      }
    
      // Start the timer when the component mounts
      useEffect(() => {
        startRotationTimer()
    
        // Clean up the timer when the component unmounts
        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }, [])
    
      

    
     
      
       const Slider = () => {
        return (
            <div className="relative h-full w-full perspective-[1200px]">
            {cards.map((card, index) => {
              // Calculate the angle for each card
              const theta = (2 * Math.PI * (index - activeIndex)) / cards.length
              const radius = 300 // Distance from center
  
              return (
                <motion.div
                  key={card.id}
                  className="absolute left-1/2 top-1/2 h-[250px] w-[150px] md:w-[300px] -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    x: radius * Math.sin(theta),
                    z: radius * Math.cos(theta) - radius,
                    rotateY: (theta * 180) / Math.PI,
                    scale: index === activeIndex ? 1.2 : 1,
                    opacity: Math.cos(theta) < 0 ? 0.3 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ zIndex: Math.cos(theta) < 0 ? 0 : 10 }}
                >
                  <div className="md:h-[500px] w-full overflow-hidden rounded-[10px] md:rounded-[40px] border border-[#EEE] bg-white shadow-xl transition-shadow hover:shadow-2xl">
                    <div className="flex h-full flex-col">
                      <div className="md:h-[500px] h-[250px] overflow-hidden">
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.title}
                          className="md:h-[500px] h-[250px] w-full object-cover"
                        />
                      </div>
                      
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        
        )
      }
      


    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="bg-gray-50 p-4  flex items-center justify-center"> {/* Ajout du flex pour aligner les éléments */}
                {/* <h1 className="text-xl font-semibold">Chat with AI Builder</h1> */}
                <div className='flex items-center gap-1   rounded-full bg-[#fafafa]'>
                    <div className='p-1 px-2 py-[6px] bg-[#eee] cursor-pointer rounded-full'>
                    <svg width="20" className='h-[20px] w-[20px]' height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 10.0196C14.6358 10.3431 10.3431 14.6358 10.0196 20H9.98042C9.65687 14.6358 5.36425 10.3431 0 10.0196V9.98043C5.36425 9.65688 9.65687 5.36424 9.98042 0H10.0196C10.3431 5.36424 14.6358 9.65688 20 9.98043V10.0196Z" fill="url(#paint0_radial_809_11874)" />
  <defs>
    <radialGradient id="paint0_radial_809_11874" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.13727 9.97493) scale(21.6266 172.607)">
      <stop offset="0.385135" stop-color="#9E72BA" />
      <stop offset="0.734299" stop-color="#D65C67" />
      <stop offset="0.931035" stop-color="#D6635C" />
    </radialGradient>
  </defs>
</svg>
                    </div>
                    <div  className='p-1 px-2 py-[6px] cursor-pointer rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-[20px] w-[20px]' viewBox="0 0 28 28" fill="#000">
          <path d="M 6 2 L 24 2 L 24 11 L 15 11 Z M 6 11 L 15 11 L 24 20 L 15 20 L 15 29 L 6 20 Z"></path>
      </svg>
                    </div>
                </div>
                <div>
                <div className="flex items-center gap-4">
    <label className="mr-4">
        
        <select 
            value={projectType} 
            onChange={(e) => setProjectType(e.target.value as 'web' | 'mobile')}
            className="sr-only" // Ajoute cette classe pour masquer l'élément
        >
            <option value="web">Web</option>
            <option value="mobile">Mobile (React Native Expo)</option>
        </select>
    </label>

    {/* Sélecteur personnalisé */}
    
</div>

                    {webContainerURL && (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleIframeSize}>
                            {isIframeExtended ? 'Restore Preview' : 'Extend Preview'}
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow  flex flex-col md:flex-row overflow-hidden">
                {/* Chat Zone */}
                <div className={`flex-grow flex flex-col p-4 ${webContainerURL ? 'md:w-1/2' : 'md:w-full'}`}>
                    {/* Messages Display */}
                    <div className="flex-grow overflow-y-auto space-y-2">
                    {messages.map((message, index) => {
  const filesIndex = message.isCode ? message.text.indexOf('Fichiers:') : -1;
  const structureIndex = message.isCode ? message.text.indexOf('Structure du Projet:') : -1;
  const shouldHide = message.isCode && (filesIndex !== -1 || structureIndex !== -1);

  return (
    <div
      key={message.$id || index}
      className={`flex items-start ${message.isUser ? 'justify-end' : 'justify-start'} ${shouldHide ? 'opacity-0' : ''}`}
    >
      {!message.isUser && (
        <div className="mr-2">
          <GeminiIcon />
        </div>
      )}
      <div
        className={`rounded-xl rounded-tr-[3px] px-4 py-3 mb-2 ${message.isUser
          ? 'bg-[#E9EEF6] '
          : 'text-[17px]'
          }`}
        style={{ maxWidth: '80%' }}
      >
        {message.isCode ? (
          <p className="whitespace-pre-wrap mb-2">{message.text}</p>
        ) : (
          <p className="whitespace-pre-wrap font-semIbold mb-2">{message.text}</p>
        )}
      </div>
    </div>
  );
})}
                       <div
    className={`h-full w-full overflow-x-hidden flex items-center justify-center gap-1 transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
>
<Slider></Slider>

                        </div>
                    </div>
                    <div className='fixed bottom-4 left-12  md:left-[30%] flex flex-col gap-1 items-center justify-center'>
                    <div
        className={`flex gap-2 bg-[#EEE] not-md:mb-24 rounded-[10px] transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
        <div 
            className={`px-4 py-1 transition-colors duration-200 rounded-[12px] flex items-center justify-center cursor-pointer ${projectType === 'web' ? 'bg-black text-[#E4E4E4]' : 'font-semibold'}`}
            onClick={() => setProjectType('web')}
        >
            Web
        </div>
        <div 
            className={`px-4 py-[2px] transition-colors duration-200 rounded-[12px] flex items-center justify-center cursor-pointer ${projectType === 'mobile' ? 'bg-black text-[#E4E4E4]' : ' font-semibold'}`}
            onClick={() => setProjectType('mobile')}
        >
            Mobile
        </div>
    </div>
    <div
        className={`flex absolute justify-center flex-col md:flex-row gap-1 -mt-28 transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
                           <div className='flex transition-all bg-[#EDEDEDB8] select-none cursor-pointer hover:bg-[#fafafa] items-center whitespace-nowrap  justify-center px-2 py-1  border-[#EEE] rounded-[10px] backdrop-blur-3xl z-20 gap-1'>
                                <div className='h-[27px] w-[27px] rounded-[10px]'>
                                    <img src="/icons/Netflix logo.png" className='rounded-[10px]' alt="" />
                                </div>
                                <h2 className="text-1xl font-semibold">Build me a Netflix clone</h2>
                            </div>
                            <div className='flex transition-all bg-[#EDEDEDB8] select-none cursor-pointer hover:bg-[#fafafa] items-center whitespace-nowrap  justify-center px-2 py-1  border-[#EEE] rounded-[10px] backdrop-blur-3xl z-20 gap-1'>
                                <div className='h-[27px] w-[27px] rounded-[10px]'>
                                    <img src="/icons/Spotify logo.png" className='rounded-[10px]' alt="" />
                                </div>
                                <h2 className="text-1xl font-semibold">Build me a Spotify clone</h2>
                            </div>
                            <div className='flex transition-all bg-[#EDEDEDB8] select-none cursor-pointer hover:bg-[#fafafa] items-center whitespace-nowrap  justify-center px-2 py-1  border-[#EEE] rounded-[10px] backdrop-blur-3xl z-20 gap-1'>
                                <div className='h-[27px] w-[27px] rounded-[10px]'>
                                    <img src="/icons/Threads logo.png" className='rounded-[10px]' alt="" />
                                </div>
                                <h2 className="text-1xl font-semibold">Build me a Threads clone</h2>
                            </div>
                        </div>
                    <div className="md:w-[600px] w-[300px] h-[100px] md:h-[130px] mt-18  backdrop-blur-lg  bg-[#EDEDEDB8]  rounded-[25px]">
                            <div className='w-full p-2'>
                            <textarea
    placeholder="Ask AI to build you an app..."
    value={userPrompt}
    onChange={handleInputChange}
    onKeyDown={handleKeyDown}
    disabled={isSending || isWebContainerActive} // Désactiver si envoi en cours ou WebContainer actif
    className="w-full h-[120px] p-3 border-none focus:outline-none rounded-[25px] resize-none"
/>
                            </div>
                            <div className=" bottom-1 p-2 w-full absolute flex items-center justify-between">
                                <div className="items-center gap-1 flex">
                                <div >
                                {/* <Terminal
    webContainer={webContainer}
    codeFiles={codeFiles}
    setWebContainerURL={setWebContainerURL}
    projectType={projectType}
/> */}
                                </div>

                                    <div className="px-1 py-1 rounded-[12px]">
                                    {userPrompt.trim() === '' ? (
                                         <Paperclip size={20} color='#888' className='pointer-events-none'></Paperclip>
                                    ) : (
                                        <Paperclip size={20} color='#000' className='pointer-events-auto cursor-pointer'></Paperclip>
                                    )}
                                       
                                    </div>
                                    <div className="px-1 py-1 rounded-[12px]">
                                    {userPrompt.trim() === '' ? (
                                         <Stars size={20} color='#888' className='pointer-events-none'></Stars>
                                    ) : (
                                        <Stars size={20} color='#000' className='pointer-events-auto cursor-pointer'></Stars>
                                    )}
                                       
                                    </div>
                                    <div className="px-1 py-1 rounded-[12px]">
                                    {userPrompt.trim() === '' ? (
                                         <Mic size={20} color='#888' className='pointer-events-none'></Mic>
                                    ) : (
                                        <Mic size={20} color='#000' className='pointer-events-auto cursor-pointer'></Mic>
                                    )}
                                       
                                    </div>
                                </div>
                                <button onClick={sendMessage} disabled={isSending}>
                                    {userPrompt.trim() === '' ? (
                                        <div className="px-2 py-2 rounded-[12px] bg-[#fafafa] opacity-70">
                                            <Send size={18} />
                                        </div>
                                    ) : (
                                        <div className="px-2 py-2 rounded-[12px] bg-[#000]">
                                            <Send size={18} color="white" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    

                    {/* Message Input Zone  */}
                    {/* <div className="mt-4">
                        <div className='w-full flex items-center justify-center'>
                        
                        </div>
                    </div> */}
                </div>

                {/* Iframe (Displayed if webContainerURL exists) */}
                {webContainerURL && (
                projectType === 'mobile' ? (
                    // Si le type est mobile, on encapsule l'iframe dans la div stylisée
                    
                    <div className={`flex-grow flex items-center justify-center overflow-hidden ${isIframeExtended ? 'md:w-full fixed top-0 z-[999]' : 'md:w-1/2'}`} style={{ height: '100%' }}>
                        <div className={`w-[320px] h-[550px] border border-[#EEE] rounded-[40px] overflow-hidden`}>
                        <iframe
                            ref={iframeRef}
                            src={webContainerURL}
                            width="100%"
                            height="100%"
                            title="WebContainer Preview"
                            className="border-none"
                        />
                        
                    </div>
                    </div>
                ) : (
                    // Sinon, on affiche l'iframe dans sa div d'origine
                    <div className={`flex-grow overflow-hidden ${isIframeExtended ? 'md:w-full fixed top-0 z-[999]' : 'md:w-1/2'}`} style={{ height: '100%' }}>
                        <iframe
                            ref={iframeRef}
                            src={webContainerURL}
                            width="100%"
                            height="100%"
                            title="WebContainer Preview"
                            className="border-none"

                        />
                    </div>
                )
            )}
            </div>

            {/* WebContainerComponent  */}
            <WebContainerComponent
                lastAIMessageWithCode={lastAIMessageWithCode}
                setWebContainerURL={setWebContainerURL}
                projectType={projectType}
                extractCodeFiles={extractCodeFiles}
                onWebContainerStart={handleWebContainerStart}
                onWebContainerStop={handleWebContainerStop}
            />

            {/* Extracted Files Zone (Hidden) */}
            <div className="sr-only">
    <CodeFileList lastAIMessageWithCode={lastAIMessageWithCode} />
</div>
        </div>
    );
};

export default Builder;