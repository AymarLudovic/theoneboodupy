import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import WebContainerComponent from './WebContainerComponent';

import { useParams } from 'react-router-dom';
import { Client, Databases, ID, Query } from 'appwrite';



import { SVGProps } from "react";

type SafariMode = "default" | "simple";

export interface SafariProps extends SVGProps<SVGSVGElement> {
  url?: string;
  imageSrc?: string;
  videoSrc?: string;
  width?: number;
  height?: number;
  mode?: SafariMode;
}









import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-monokai';

import 'ace-builds/src-noconflict/theme-github';

import 'ace-builds/src-noconflict/ext-language_tools';




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
    const [showCode, setShowCode] = useState(false);
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

    

    

    const [isReloaded, setIsReloaded] = useState<boolean>(true);// Initial state is false

    useEffect(() => {
        const fetchIsReloadedFromAppwrite = async () => {
          if (!appId) {
            console.warn('No ID found in URL parameters to fetch reload state.');
            return;
          }
      
          const projectId = '679d739b000950dfb1e0';
          const databaseId = 'Boodupy-database-2025';
          const collectionId = 'setStarted-200900';
          const appwriteEndpoint = 'https://cloud.appwrite.io/v1';
      
          const client = new Client()
            .setEndpoint(appwriteEndpoint)
            .setProject(projectId);
      
          const databases = new Databases(client);
      
          try {
            const response = await databases.listDocuments(
              databaseId,
              collectionId,
              [Query.equal('$id', appId)] // Query for the document with the appId as its ID
            );
      
              // Détecter le rechargement manuel
              const isManualReload = performance.navigation.type === performance.navigation.TYPE_RELOAD;
      
              if (response.documents.length > 0) {
                // Document exists
                  if (isManualReload) {
                      setIsReloaded(true); // Forcer isReloaded à true après un rechargement manuel
                      console.log('Page reloaded, forcing isReloaded to true.');
                  } else {
                      setIsReloaded(response.documents[0].isSessionStarted);  // Utiliser la valeur d'Appwrite
                  }
              } else {
                // Document doesn't exist, so it's the first load
                  setIsReloaded(true); // Set to true si il n'y a rien
                console.log('Document not found, assuming first load.');
              }
          } catch (error) {
            console.error('Error fetching isReloaded from Appwrite:', error);
          }
        };
      
        fetchIsReloadedFromAppwrite();
      }, [appId]);

      useEffect(() => {
        if (appId) {
          const updateIsSessionStartedInAppwrite = async () => {
            const projectId = '679d739b000950dfb1e0';
            const databaseId = 'Boodupy-database-2025';
            const collectionId = 'setStarted-200900';
            const appwriteEndpoint = 'https://cloud.appwrite.io/v1';
      
            const client = new Client()
              .setEndpoint(appwriteEndpoint)
              .setProject(projectId);
      
            const databases = new Databases(client);
      
            try {
              // Tentative de mise à jour du document
              try {
                await databases.updateDocument(
                  databaseId,
                  collectionId,
                  appId, // Utiliser l'appId comme ID du document
                  {
                    isSessionStarted: false, // Mettre à jour à false après le chargement initial
                  }
                );
                console.log(`isSessionStarted updated to false for document ID: ${appId}`);
              } catch (updateError: any) {
                // Si le document n'existe pas, le créer
                if (updateError.code === 404) {
                  try {
                    await databases.createDocument(
                      databaseId,
                      collectionId,
                      appId, // Utiliser l'appId comme ID du document
                      {
                        isSessionStarted: false, // Initialiser à false
                        id: appId,
                      }
                    );
                    console.log(`Document created with ID: ${appId} and isSessionStarted set to false`);
                  } catch (createError) {
                    console.error(`Error creating document with ID: ${appId}`, createError);
                  }
                } else {
                  console.error(`Error updating document with ID: ${appId}`, updateError);
                }
              }
            } catch (error) {
              console.error('Error updating isSessionStarted in Appwrite:', error);
            }
          };
      
          // Condition pour exécuter cet effet seulement si isReloaded est true (premier chargement)
          if (isReloaded) {
            updateIsSessionStartedInAppwrite();
          }
        }
      }, [appId, isReloaded]); // Dépendance de isReloaded ajoutée

      useEffect(() => {
        if (appId && isReloaded) {
          const updateOrCreateAppwriteDocument = async () => {
            const projectId = '679d739b000950dfb1e0';
            const databaseId = 'Boodupy-database-2025';
            const collectionId = 'setStarted-200900';
            const appwriteEndpoint = 'https://cloud.appwrite.io/v1';
      
            const client = new Client()
              .setEndpoint(appwriteEndpoint)
              .setProject(projectId);
      
            const databases = new Databases(client);
      
            try {
              try {
                await databases.updateDocument(databaseId, collectionId, appId, {
                  isSessionStarted: true,
                });
                console.log(`Appwrite document updated successfully for ID: ${appId}`);
              } catch (updateError: any) {
                if (updateError.code === 404) {
                  try {
                    await databases.createDocument(databaseId, collectionId, appId, {
                      isSessionStarted: true,
                    });
                    console.log(`Appwrite document created successfully for ID: ${appId}`);
                  } catch (createError) {
                    console.error(`Error creating Appwrite document for ID: ${appId}`, createError);
                  }
                } else {
                  console.error(`Error updating Appwrite document for ID: ${appId}`, updateError);
                }
              }
            } catch (error) {
              console.error(`General error with Appwrite for ID: ${appId}`, error);
            }
          };
      
          updateOrCreateAppwriteDocument();
        } else {
          console.log(`Appwrite update or create skipped  appId: ${appId} reloaded:${isReloaded}`);
        }
      }, [appId, isReloaded]);

    

const [projectStructure, setProjectStructure] = useState<string>('');

useEffect(() => {
    console.log("Project structure will be set.");
}, [setProjectStructure]);

useEffect(() => {
  console.log("Project structure will be set.");
}, [projectStructure]);

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
  if (projectType === 'web') {
      return `**Prompt Initial pour l'IA**

Tu es une IA spécialisée dans la génération de sites web fullstack modernes et bien conçus. Tu dois créer des projets basés sur **Vite + React + TypeScript** avec une structure de fichiers bien définie :  

- \`index.html\` : Fichier d'entrée principal avec les polices \`DM Sans\`, \`Space Grotesk\`, et \`Poppins\` incluses.  
- \`src/index.css\` : Contient les styles globaux avec **Tailwind CSS** activé (\`@tailwind base; @tailwind components; @tailwind utilities;\`).  
- \`tailwind.config.js\` : Fichier de configuration de Tailwind CSS.  
- \`postcss.config.js\` : Fichier de configuration de PostCSS.  
- \`src/App.tsx\` : Composant racine de l'application React.  
- \`tsconfig.json\` & \`tsconfig.node.json\` : Configurations TypeScript de base.  
- \`eslint.config.js\` : Configuration ESLint pour assurer un code propre et optimisé.  
- \`.gitignore\` : Pour exclure les fichiers inutiles du suivi Git.  
- \`README.md\` : Documentation du projet.  
- \`package.json\` : Où toute les dependances du projet seront seront installer.  
---

### 🔹 **Style & Design**  
- L'interface doit être **moderne, épurée et ultra-design**, inspirée de sites comme **Revolut, Instagram, Rarible, Airbnb**.  
- Utilisation de **composants réutilisables et bien structurés** (Navbar, Sidebar, Footer, Modals, Cards...).  
- Ajout d'animations et micro-interactions avec **GSAP / Framer Motion**.  

---

### 🔹 **Technologies & Bonnes Pratiques**  
- Toujours utiliser les **dernières versions des dépendances** dans \`package.json\`.  
- Code **optimisé et performant** avec une bonne structure de composants.  
- UI/UX pensée pour être **fluide et intuitive**.  

### Important: Donne une exmplication de ce que tu vas faire en maximum 8 lignes et si la question n'est pas a but generatif de la plateforme, répond simplement à l'utilisateur, par exemple lorsqu'il te dit bonjour.


          `;
  } else { // projectType === 'mobile'
    return `Tu es un expert en conception et développement d'applications mobiles avec React Native et Expo, utilisant Expo Router pour la navigation. Ton rôle est double :

1.  **Générer un Cahier des Charges Technique Exhaustif :**
  *   Avant de commencer à générer le code, tu vas d'abord créer un cahier des charges technique complet et détaillé pour l'application demandée par l'utilisateur. Ce cahier des charges doit inclure :
      *   **Objectifs et Portée :** Description précise de l'objectif de l'application et des fonctionnalités incluses.
      *   **Public Cible :** Identification du public cible de l'application.
      *   **Fonctionnalités Détaillées :** Description détaillée de chaque fonctionnalité, écran et composant de l'application. Pour chaque fonctionnalité, tu dois préciser :
          *   L'interface utilisateur (champs, boutons, listes, etc.)
          *   La logique métier (validation, gestion des données, appels API, etc.)
          *   Les états possibles (chargement, erreur, succès, etc.)
          *   Les interactions utilisateur (navigation, actions, etc.)
      *   **Architecture Technique :**
          *   Structure de navigation (onglets, piles, etc.)
          *   Choix des composants React Native et Expo
          *   Gestion des données (états React, contexte React, Redux, AsyncStorage, etc.)
          *   API (points de terminaison, formats de données, authentification, etc.)
          *   Style (approche CSS, thèmes, etc.)
      *   **Sécurité :**
          *   Mesures de protection contre les vulnérabilités (XSS, CSRF, etc.)
          *   Gestion des données sensibles (chiffrement, etc.)
      *   **Performance :**
          *   Optimisation du chargement des images et vidéos
          *   Utilisation efficace de la bande passante
      *   **Accessibilité :**
          *   Texte alternatif pour les images
          *   Compatibilité avec les lecteurs d'écran
      *   **Internationalisation (si applicable) :**
          *   Support multilingue
          *   Formats de date et d'heure localisés
      *   **Tests :**
          *   Types de tests à effectuer (unitaires, d'intégration, fonctionnels, etc.)
      *   **Déploiement :**
          *   Environnements (développement, test, production)
          *   Processus de déploiement

  *   Le cahier des charges doit être structuré de manière claire et concise, avec des titres, des sous-titres, des listes et des exemples.
  *   **Important :** Le cahier des charges doit être *suffisamment détaillé* pour qu'un développeur humain puisse implémenter l'application en se basant uniquement sur ce document.

2.  **Générer le Code de l'Application :**
  *   Une fois le cahier des charges établi, tu vas générer le code React Native et Expo de l'application, en respectant scrupuleusement les spécifications du cahier des charges.
  *   Cela inclut la génération de *tous* les fichiers nécessaires, même les plus petits (composants UI réutilisables, fichiers de configuration, etc.).
  *   La structure du projet doit inclure *tous* les fichiers et dossiers suivants :

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

  *   **Important :** La structure de répertoires *DOIT* être respectée. Si la navigation par onglets est utilisée, les fichiers d'écran (comme \`index.tsx\`) *DOIVENT* être placés dans le répertoire \`app/(tabs)/\`.

  *   **Important :** Le code généré doit être clair, bien commenté et facile à comprendre. Utilise des noms de fichiers et de variables descriptifs.
  *   **Important :** Chaque page/composant doit être ENTIÈREMENT FONCTIONNEL, pas seulement une structure vide.
  *   **Important :** Pour CHAQUE page ou composant que tu génères:
      *   Implémente le design complet avec Tailwind CSS (pas juste des placeholders)
      *   Implémente toute la logique fonctionnelle (gestion d'état, validation, appels API)
      *   Ajoute des données fictives réalistes pour démontrer le fonctionnement
  *   **Important :** N'utilise PAS de textes génériques comme "Contenu de la page" - implémente un contenu réel et pertinent.
  *   **Important :** Chaque page doit être directement utilisable sans modification supplémentaire.

  *   **Important :** Respecte la structure de base Expo Router mentionnée ci-dessus.
  *   **Important :** Le script \`dev\` dans \`package.json\` doit *toujours* être \`"EXPO_NO_TELEMETRY=1 expo start"\`.
  *   **Important :** Ne génère pas de code inutile pour \`App.js\`, \`app.json\`, \`babel.config.js\` et \`expo-env.d.ts\` car ils sont déjà configurés par Expo et n'ont généralement pas besoin d'être modifiés directement. Concentre-toi sur le code spécifique à l'application demandée.
  *   **Important :** L'objectif principal est de générer une application fonctionnelle et complete.

**EXIGENCE DE COMPLÉTUDE:**

*   Ne te contente PAS de créer des écrans vides avec des titres génériques.
*   Chaque écran DOIT avoir:
  *   Une interface utilisateur complète et détaillée
  *   Tous les composants d'UI nécessaires (formulaires, listes, boutons, etc.)
  *   La logique d'état complète (useState, useContext, etc.)
  *   Des interactions réelles et fonctionnelles
  *   Des données fictives pour démontrer le fonctionnement
*   Si l'écran est "Profil", implémente TOUS les éléments d'un profil complet (photo, infos, paramètres, etc.)
*   Si l'écran est "Recherche", implémente un champ de recherche FONCTIONNEL avec filtres et résultats
*   Les composants doivent être réutilisables et bien structurés
  
En résumé, voici les étapes à suivre :
1. **Étape 1 : Analyse et Cahier des Charges :** Tu demandes à l'IA de générer un cahier des charges technique très détaillé, comme expliqué ci-dessus.
2. **Étape 2 : Génération du Code :** Tu demandes à l'IA de générer le code de l'application en se basant *exclusivement* sur le cahier des charges.

**Structure de la Réponse :**

Ta réponse doit être structurée de la manière suivante :

\`\`\`
**Cahier des Charges Technique :**

[Contenu du cahier des charges détaillé]

**Code de l'Application :**

\`\`\`
[Contenu des fichiers (package.json, app/_layout.tsx, app/index.tsx, etc.)]
\`\`\`
\`\`\`
        `;
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
    // Initialisation Appwrite
    const projectId = "679d739b000950dfb1e0";
    const databaseId = "Boodupy-database-2025";
    const collectionId = "setStarted-200900";
    const appwriteEndpoint = "https://cloud.appwrite.io/v1";
  
    const client = new Client().setEndpoint(appwriteEndpoint).setProject(projectId);
  
    const databases = new Databases(client);
  
    let isSessionStarted = false;
    console.log(appId);
  
    if (appId) {
      // Vérification que appId a une valeur
      // Récupérer la valeur de isSessionStarted depuis Appwrite
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("id", appId),
        ]); // Utiliser 'id' au lieu de '$id'
  
        if (response.documents.length > 0) {
          isSessionStarted = response.documents[0].isSessionStarted;
        } else {
          console.log(
            "Document not found in sendMessage, assuming isSessionStarted is false."
          );
        }
      } catch (error) {
        console.error(
          "Error fetching isSessionStarted from Appwrite in sendMessage:",
          error
        );
        // En cas d'erreur, on suppose que isSessionStarted est false pour permettre l'envoi du message
      }
    } else {
      console.warn("appId is undefined in sendMessage. Skipping Appwrite fetch.");
    }
  
    // **MODIFICATION IMPORTANTE : Utilisation de isSessionStarted directement**
    if (!isSessionStarted) {
      // Si isSessionStarted est false, on exécute le code initial
      if (!userPrompt.trim() || isSending || !appId) return;
  
      setIsSending(true);
      const newMessage = { text: userPrompt, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUserPrompt("");
  
      // Cacher les éléments après l'envoi du premier message
      setAreElementsHidden(true);
  
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
        if (!apiKey) {
          console.error("GEMINI_API_KEY is missing in environment variables.");
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Error: API Key is missing in environment variables.", isUser: false },
          ]);
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
        const history = messages
          .map((msg) => `${msg.isUser ? "User: " : "AI: "}${msg.text}`)
          .join("\n");
  
        const input =
          initialPrompt +
          "\n\n" +
          "**Historique de la conversation :**\n" +
          history +
          "\n\n" +
          fileExtractionPromptText +
          improvePromptText +
          projectStructurePromptText +
          "\n\n" + // Ajout de projectStructurePromptText ici
          "**Nouvelle question de l'utilisateur :**\n" +
          userPrompt;
  
        const result = await model.generateContent(input);
        let responseText = result.response.text();
  
        const extractedFiles = extractCodeFiles(responseText);
        setCodeFiles(extractedFiles);
  
        const isCodeResponse = responseText.includes("<Extracted_code>");
  
        const geminiMessage = {
          text: responseText,
          isUser: false,
          isCode: isCodeResponse,
        };
        setMessages((prevMessages) => [...prevMessages, geminiMessage]);
        setLastAIMessageWithCode(geminiMessage);
        lastWebContainerCodeRef.current = responseText;
  
        await saveMessageToAppwrite({ ...newMessage, appId: appId, createdAt: new Date() });
        await saveMessageToAppwrite({ ...geminiMessage, appId: appId, createdAt: new Date() });
  
          const updatedMessages = [...messages.filter(msg => msg.isCode), geminiMessage];
          combineAllAICode(updatedMessages);
  
      } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Error: ${error}`, isUser: false },
        ]);
      } finally {
        setIsSending(false);
      }
  
      // Mettre à jour la valeur de isSessionStarted dans Appwrite à true
      if (appId) {
        try {
          await databases.updateDocument(databaseId, collectionId, appId, {
            isSessionStarted: true, // Mettre à jour à true
          });
          console.log(`isSessionStarted updated to true for document ID: ${appId}`);
          setIsReloaded(true);
        } catch (updateError: any) {
          // Si le document n'existe pas, le créer
          if (updateError.code === 404) {
            try {
              await databases.createDocument(databaseId, collectionId, appId, {
                isSessionStarted: true, // Initialiser à true
                id: appId,
              });
              console.log(
                `Document created with ID: ${appId} and isSessionStarted set to true`
              );
              setIsReloaded(true);
            } catch (createError) {
              console.error(`Error creating document with ID: ${appId}`, createError);
            }
          } else {
            console.error(`Error updating document with ID: ${appId}`, updateError);
          }
        }
      } else {
        console.warn("appId is undefined, skipping Appwrite update.");
      }
    } else {
      // Si isSessionStarted est true, on exécute le code de continuation
      if (!userPrompt.trim() || isSending || !appId) return;
  
      setIsSending(true);
      const newMessage = { text: userPrompt, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUserPrompt("");
  
      // Cacher les éléments après l'envoi du premier message
      setAreElementsHidden(true);
  
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
        if (!apiKey) {
          console.error("GEMINI_API_KEY is missing in environment variables.");
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Error: API Key is missing in environment variables.", isUser: false },
          ]);
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
  
        // Construction de l'historique des messages
        const history = messages
          .map((msg) => `${msg.isUser ? "User: " : "AI: "}${msg.text}`)
          .join("\n");
  
        const input =
          initialPrompt +
          "\n\n" +
          "**Historique de la conversation :**\n" +
          history +
          "\n\n" +
          fileExtractionPromptText +
          "\n\n" +
          projectStructurePromptText +
          "\n\n" +
          "**Nouvelle question de l'utilisateur :**\n" +
          userPrompt;
  
        const result = await model.generateContent(input);
        let responseText = result.response.text();
  
        const extractedFiles = extractCodeFiles(responseText);
        setCodeFiles(extractedFiles);
  
        const isCodeResponse = responseText.includes("<Extracted_code>");
  
        const geminiMessage = {
          text: responseText,
          isUser: false,
          isCode: isCodeResponse,
        };
        setMessages((prevMessages) => [...prevMessages, geminiMessage]);
  
        await saveMessageToAppwrite({ ...newMessage, appId: appId, createdAt: new Date() });
        await saveMessageToAppwrite({ ...geminiMessage, appId: appId, createdAt: new Date() });
  
          const updatedMessages = [...messages.filter(msg => msg.isCode), geminiMessage];
          combineAllAICode(updatedMessages);
  
      } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Error: ${error}`, isUser: false },
        ]);
      } finally {
        setIsSending(false);
      }
  
      // Mettre à jour la valeur de isSessionStarted dans Appwrite à true
      if (appId) {
        try {
          await databases.updateDocument(databaseId, collectionId, appId, {
            isSessionStarted: true, // Mettre à jour à true
          });
          console.log(`isSessionStarted updated to true for document ID: ${appId}`);
        } catch (updateError: any) {
          // Si le document n'existe pas, le créer
          if (updateError.code === 404) {
            try {
              await databases.createDocument(databaseId, collectionId, ID.unique(), {
                isSessionStarted: true, // Initialiser à true
                id: appId,
              });
              console.log(
                `Document created with ID: ${appId} and isSessionStarted set to true`
              );
            } catch (createError) {
              console.error(`Error creating document with ID: ${appId}`, createError);
            }
          } else {
            console.error(`Error updating document with ID: ${appId}`, updateError);
          }
        }
      } else {
        console.warn("appId is undefined, skipping Appwrite update.");
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


{!webContainerURL &&(
  <div className='w-full flex-col relative h-auto flex items-center justify-center'>
                <div className='md:w-[50%] md:relative md:mb-84 not-md:w-[90%]'>
                {messages.map((message, index) => {
        if (message.isCode) {
          const fileRegex = /Nom du fichier: (.+?)\n<Extracted_code>\n([\s\S]*?)\n<\/Extracted_code>/g;
          const files = [];
          let match;

          while ((match = fileRegex.exec(message.text)) !== null) {
            files.push({ name: match[1], code: match[2] });
          }

          return (
            <div key={message.$id || index} className="flex flex-col items-start w-full">
              {!message.isUser && <div className="mr-2"><GeminiIcon /></div>}

              {/* Affichage du message sans les fichiers */}
              <div className="rounded-xl rounded-tr-[3px] px-4 py-3 mb-2 bg-[#] max-w-[80%]">
                <p className="whitespace-pre-wrap line-clamp-10 mb-2">
                  {message.text.replace(fileRegex, "").trim()}
                </p>
              </div>

              {/* Affichage des fichiers extraits */}

              <button 
              style={{border: "1px solid #eee", fontSize: "14px"}}
  className="px-3 py-1 bg-white border border-[#EEE] text-[12px] rounded-[25px]"
  onClick={() => setShowCode(!showCode)}
>
  {showCode ? "Hide Code" : "Show Code"}
</button>

<div
      className={`
        text-gray-700 
        w-[70%]
        ${showCode ? '' : ' sr-only '}
        p-4 rounded-md
      `}
    >
              {files.map((file, fileIndex) => (
                <div key={fileIndex} className="h-[200px] w-[90%] overflow-x-hidden bg-white text-black border border-[#EEE] rounded-[22px]  my-2 overflow-auto">
                  <div className="w-full px-3 py-2 border-b border-[#EEE] flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="!inline-block h-[18px] w-[18px] size-full" viewBox="0 0 16 16"><g fill="none" stroke="#8caaee" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11.3c4.14 0 7.5-1.28 7.5-2.86S12.14 5.58 8 5.58.5 6.86.5 8.44s3.36 2.87 7.5 2.87Z"></path><path d="M5.52 9.87c2.07 3.6 4.86 5.86 6.23 5.07 1.37-.8.8-4.34-1.27-7.93S5.62 1.16 4.25 1.95s-.8 4.34 1.27 7.92"></path><path d="M5.52 7.01c-2.07 3.59-2.64 7.14-1.27 7.93s4.16-1.48 6.23-5.07c2.07-3.58 2.64-7.13 1.27-7.92-1.37-.8-4.16 1.47-6.23 5.06"></path><path d="M8.5 8.44a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5"></path></g></svg>
                      <h3 className="min-w-0 truncate text-left text-xs text-forgerground">{file.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                    <button
  onClick={() => {
    try {
      navigator.clipboard.writeText(file.code);
      alert("Code copied to clipboard!"); // ou utilisez une notification plus élégante
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy code to clipboard.");
    }
  }}
  className="  rounded text-xs"
>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clipboard size-3"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
</button>
                    </div>
                  </div>
                  <AceEditor
                    mode="javascript" // Détecter automatiquement le mode à partir du nom de fichier
                    theme="github"
                    value={file.code}
                    readOnly={true} // Empêche la modification du code
                    height="160px"  // Ajuste la hauteur si nécessaire
                    width="100%"
                    fontSize={13}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: false,
                      showLineNumbers: false,
                      tabSize: 4,
                    }}
                  />
                </div>
              ))}
              </div>
            </div>
          );
        }

        return (
          <div key={message.$id || index} className={`flex items-start ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            {!message.isUser && <div className="mr-2"><GeminiIcon /></div>}

            <div className={`rounded-full px-4 py-2  flex items-center justify-center  mb-2 ${message.isUser ? 'border h-auto border-[#fafafa] bg-[#fafafa] rounded-full flex items-center justify-center' : 'text-[17px]'}`} >
              <p className="whitespace-pre-wrap  ">{message.text}</p>
            </div>
          </div>
        );
      })}
                </div>
                
                {!webContainerURL &&(
                  <div className='w-full fixed flex items-center z-[9999] justify-center bottom-3'>
                  <div className='md:w-[600px] bg-white z-[9999] rounded-[25px] border border-[#fafafa] p-2'>
                              <textarea
      placeholder="Ask AI to build you an app..."
      value={userPrompt}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={isSending || isWebContainerActive} // Désactiver si envoi en cours ou WebContainer actif
      className="w-full h-[120px] p-3 border-none focus:outline-none rounded-[25px] resize-none"
  />

  <button onClick={sendMessage}>send</button>
                  </div>
                              
                  </div>
                )}

{webContainerURL &&(
                  <div className='w-full  fixed  flex items-center z-[9999] justify-start bottom-3'>
                  <div className='md:w-[600px] md:ml-20 bg-white z-[9999] rounded-[25px] border border-[#fafafa] p-2'>
                              <textarea
      placeholder="Ask AI to build you an app..."
      value={userPrompt}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={isSending || isWebContainerActive} // Désactiver si envoi en cours ou WebContainer actif
      className="w-full h-[120px] p-3 border-none focus:outline-none rounded-[25px] resize-none"
  />

  <button onClick={sendMessage}>send</button>
                  </div>
                              
                  </div>
                )}
            </div>
)}

{webContainerURL &&(
  <div className='md:w-1/2  flex-col relative h-auto flex items-center justify-center'>
                <div className='md:w-full p-4 md:relative md:mb-84 not-md:w-[90%]'>
                {messages.map((message, index) => {
        if (message.isCode) {
          const fileRegex = /Nom du fichier: (.+?)\n<Extracted_code>\n([\s\S]*?)\n<\/Extracted_code>/g;
          const files = [];
          let match;

          while ((match = fileRegex.exec(message.text)) !== null) {
            files.push({ name: match[1], code: match[2] });
          }

          return (
            <div key={message.$id || index} className="flex flex-col items-start w-full">
              {!message.isUser && <div className="mr-2"><GeminiIcon /></div>}

              {/* Affichage du message sans les fichiers */}
              <div className="rounded-xl rounded-tr-[3px] px-4 py-3 mb-2 bg-[#] max-w-[80%]">
                <p className="whitespace-pre-wrap line-clamp-10 mb-2">
                  {message.text.replace(fileRegex, "").trim()}
                </p>
              </div>

              {/* Affichage des fichiers extraits */}

              <button 
              style={{border: "1px solid #eee", fontSize: "14px"}}
  className="px-3 py-1 bg-white border border-[#EEE] text-[12px] rounded-[25px]"
  onClick={() => setShowCode(!showCode)}
>
  {showCode ? "Hide Code" : "Show Code"}
</button>

<div
      className={`
        text-gray-700 
        w-[100%]
        ${showCode ? '' : ' sr-only '}
        p-4 rounded-md
      `}
    >
              {files.map((file, fileIndex) => (
                <div key={fileIndex} className="h-[200px] w-[100%] overflow-x-hidden bg-white text-black border border-[#EEE] rounded-[22px]  my-2 overflow-auto">
                  <div className="w-full px-3 py-2 border-b border-[#EEE] flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="!inline-block h-[18px] w-[18px] size-full" viewBox="0 0 16 16"><g fill="none" stroke="#8caaee" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11.3c4.14 0 7.5-1.28 7.5-2.86S12.14 5.58 8 5.58.5 6.86.5 8.44s3.36 2.87 7.5 2.87Z"></path><path d="M5.52 9.87c2.07 3.6 4.86 5.86 6.23 5.07 1.37-.8.8-4.34-1.27-7.93S5.62 1.16 4.25 1.95s-.8 4.34 1.27 7.92"></path><path d="M5.52 7.01c-2.07 3.59-2.64 7.14-1.27 7.93s4.16-1.48 6.23-5.07c2.07-3.58 2.64-7.13 1.27-7.92-1.37-.8-4.16 1.47-6.23 5.06"></path><path d="M8.5 8.44a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5"></path></g></svg>
                      <h3 className="min-w-0 truncate text-left text-xs text-forgerground">{file.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                    <button
  onClick={() => {
    try {
      navigator.clipboard.writeText(file.code);
      alert("Code copied to clipboard!"); // ou utilisez une notification plus élégante
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy code to clipboard.");
    }
  }}
  className="  rounded text-xs"
>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clipboard size-3"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
</button>
                    </div>
                  </div>
                  <AceEditor
                    mode="javascript" // Détecter automatiquement le mode à partir du nom de fichier
                    theme="github"
                    value={file.code}
                    readOnly={true} // Empêche la modification du code
                    height="160px"  // Ajuste la hauteur si nécessaire
                    width="100%"
                    fontSize={13}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: false,
                      showLineNumbers: false,
                      tabSize: 4,
                    }}
                  />
                </div>
              ))}
              </div>
            </div>
          );
        }

        return (
          <div key={message.$id || index} className={`flex items-start ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            {!message.isUser && <div className="mr-2"><GeminiIcon /></div>}

            <div className={`rounded-full px-4 py-2  flex items-center justify-center  mb-8 ${message.isUser ? 'border h-auto border-[#fafafa] bg-[#fafafa] rounded-full flex items-center justify-center' : 'text-[17px]'}`} >
              <p className="whitespace-pre-wrap  ">{message.text}</p>
            </div>
          </div>
        );
      })}
                </div>
                
                {!webContainerURL &&(
                  <div className='w-full fixed flex items-center z-[9999] justify-center bottom-3'>
                  <div className='md:w-[600px] bg-white z-[9999] rounded-[25px] border border-[#fafafa] p-2'>
                              <textarea
      placeholder="Ask AI to build you an app..."
      value={userPrompt}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={isSending || isWebContainerActive} // Désactiver si envoi en cours ou WebContainer actif
      className="w-full h-[120px] p-3 border-none focus:outline-none rounded-[25px] resize-none"
  />

  <button onClick={sendMessage}>send</button>
                  </div>
                              
                  </div>
                )}

{webContainerURL &&(
                  <div className='w-full  fixed  flex items-center z-[9999] justify-start bottom-3'>
                  <div className='md:w-[600px] md:ml-100 bg-white z-[9999] rounded-[25px] border border-[#fafafa] p-2'>
                              <textarea
      placeholder="Ask AI to build you an app..."
      value={userPrompt}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={isSending || isWebContainerActive} // Désactiver si envoi en cours ou WebContainer actif
      className="w-full h-[120px] p-3 border-none focus:outline-none rounded-[25px] resize-none"
  />

  <button onClick={sendMessage}>send</button>
                  </div>
                              
                  </div>
                )}
            </div>
)}
            

            {/* Main Content */}
            <div className="flex-grow  flex flex-col md:flex-row overflow-hidden">
                {/* Chat Zone */}
                <div className={`flex-grow justify-center items-center w-[300px] flex flex-col p-4 ${webContainerURL ? 'md:w-1/2' : 'md:w-full'}`}>
                    {/* Messages Display */}
                    <div className="flex-grow overflow-y-auto md:w-[55%] px-3 space-y-2">
                    

                       <div
    className={`h-full w-full overflow-x-hidden flex items-center justify-center gap-1 transition-opacity duration-500 ${areElementsHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
>
{/* <Slider></Slider> */}

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
                    {/* <div className="md:w-[600px] w-[300px] h-[100px] md:h-[130px] mt-18  backdrop-blur-lg  bg-[#EDEDEDB8]  rounded-[25px]">
                            
                        </div> */}
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

                  <>
                      <iframe
                            ref={iframeRef}
                            src={webContainerURL}
                            width="100%"
                            height="100%"
                            title="WebContainer Preview"
                            className="border-none"

                        />
                  </>
                    // Sinon, on affiche l'iframe dans sa div d'origine
                    
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