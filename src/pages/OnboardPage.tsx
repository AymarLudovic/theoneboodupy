import { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react'; // Import LogOut pour l'icône de déconnexion
import { Client, Databases, ID, Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';

// Initialiser Appwrite (assurez-vous que ces valeurs sont correctes et dans un .env)
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679d739b000950dfb1e0');

const databases = new Databases(client);

const OnboardPage = () => {
    const [appName, setAppName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [userApps, setUserApps] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Paramètres de la base de données et de la collection Appwrite (à configurer dans .env)
    const databaseId = 'Boodupy-database-2025';
    const collectionId = 'apps-200900';

    // UseEffect pour vérifier si l'utilisateur est connecté (via localStorage)
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            // L'utilisateur est connecté
            setUserId(storedUserId);
            fetchUserApps(storedUserId);
        } else {
            // L'utilisateur n'est pas connecté, redirection vers /signup
            navigate('/signup');
        }
    }, [navigate]); // Ajout de navigate comme dépendance

    // Fonction pour récupérer les applications de l'utilisateur depuis Appwrite
    const fetchUserApps = async (userId: string) => {
        try {
            const response = await databases.listDocuments(
                databaseId,
                collectionId,
                [
                    Query.equal('userId', userId),
                ]
            );
            setUserApps(response.documents);
        } catch (err: any) {
            console.error("Erreur lors de la récupération des applications :", err);
            setError("Erreur lors du chargement des applications.");
        }
    };

    // Fonction pour ouvrir la modal de création d'application
    const handleCreateAppClick = () => {
        setIsModalOpen(true);
    };

    // Fonction pour fermer la modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAppName('');
        setError('');
    };

    // Fonction pour créer une nouvelle application dans Appwrite
    const handleCreateApp = async () => {
        if (!appName) {
            setError("Le nom de l'application est obligatoire.");
            return;
        }

        if (!userId) {
            setError("Utilisateur non connecté.");
            return;
        }

        try {
            // Créer le document dans Appwrite
            const newApp = await databases.createDocument(
                databaseId,
                collectionId,
                ID.unique(),
                {
                    userId: userId,
                    name: appName,
                }
            );

            // Fermer la modal
            setIsModalOpen(false);
            setAppName('');

            // Rediriger vers la page du builder avec l'ID de l'application
            navigate(`/${newApp.$id}/builder`);
        } catch (err: any) {
            console.error("Erreur lors de la création de l'application :", err);
            setError("Erreur lors de la création de l'application.");
        }
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('userId'); // Supprimer l'ID utilisateur du localStorage
        setUserId(null); // Mettre à jour l'état local
        navigate('/signup'); // Rediriger vers la page d'inscription/connexion
    };

    return (
        <>
            <nav className="w-full top-0 sticky p-2 py-8 px-10 flex items-center justify-between">
                <a href="/">
                    <img src="/logo.svg" height={20} width={50} alt="Logo" />
                </a>
                <div className="flex border gap-1 border-[#EEE] select-none items-center justify-between w-auto rounded-[14px]">
                    <div className="p-1 cursor-pointer bg-[#EEE] rounded-[14px]">
                        Website
                    </div>
                    <div className="p-1 rounded-[14px] cursor-pointer">
                        Mobile apps
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCreateAppClick}
                        className="flex items-center gap-1 py-2 px-3 rounded-full border bg-[#fafafa] border-[#EEE] font-semibold"
                    >
                        <Plus size={18} />
                        Create app
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 py-2 px-3 rounded-full border bg-[#fafafa] border-[#EEE] font-semibold"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

            </nav>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <section className="w-full h-auto flex justify-center items-center gap-4 flex-wrap">
                {userApps.map((app) => (
                    <div key={app.$id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]">
                            {/* Placeholder pour l'aperçu de l'application */}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]">
                                {/* Placeholder pour l'icône de l'application */}
                            </div>
                            <h2 className="text-1xl font-semibold text-[#0A0A0A]">
                                {app.name}
                            </h2>
                        </div>
                    </div>
                ))}

                {/* Si aucune application n'est trouvée, afficher un message */}
                {userApps.length === 0 && (
                    <div className="text-gray-500 text-center">
                        Aucune application trouvée. Créez votre première application !
                    </div>
                )}
            </section>

            {/* Modal pour entrer le nom de l'application */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Create a new app</h2>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <input
                            type="text"
                            placeholder="App name"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateApp}
                                className="bg-black text-[#E4E4E4] py-2 px-4 rounded-md"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OnboardPage;