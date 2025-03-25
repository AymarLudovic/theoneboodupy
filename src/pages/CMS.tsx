import { useState, useEffect } from 'react';
import { Plus, LogOut, Globe, X } from 'lucide-react'; // Import LogOut pour l'icône de déconnexion
import { Client, Databases, ID, Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';

// Initialiser Appwrite (assurez-vous que ces valeurs sont correctes et dans un .env)
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679d739b000950dfb1e0');

const databases = new Databases(client);

const CMS = () => {
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

    const GeminiIcon = () => (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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

   

    return (
        <div className='h-screen w-full bg-black overflow-hidden'>
         <div className='fixed flex border border-[#111]  bottom-5 left-[45%] px-2 py-2 backdrop-blur-3xl rounded-full fle items-center gap-3'>
            <a href="/onboard">
            <svg width="2em" data-e2e="" height="2em" viewBox="0 0 48 48" fill="#888" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.9505 7.84001C24.3975 7.38666 23.6014 7.38666 23.0485 7.84003L6.94846 21.04C6.45839 21.4418 6.2737 22.1083 6.48706 22.705C6.70041 23.3017 7.26576 23.7 7.89949 23.7H10.2311L11.4232 36.7278C11.5409 38.0149 12.6203 39 13.9128 39H21.5C22.0523 39 22.5 38.5523 22.5 38V28.3153C22.5 27.763 22.9477 27.3153 23.5 27.3153H24.5C25.0523 27.3153 25.5 27.763 25.5 28.3153V38C25.5 38.5523 25.9477 39 26.5 39H34.0874C35.3798 39 36.4592 38.0149 36.577 36.7278L37.7691 23.7H40.1001C40.7338 23.7 41.2992 23.3017 41.5125 22.705C41.7259 22.1082 41.5412 21.4418 41.0511 21.04L24.9505 7.84001Z"></path></svg>
            </a>
            <button onClick={handleCreateAppClick}>
                <GeminiIcon></GeminiIcon>
            </button>
            <a href="" className='px-1'>
            <Globe width="1.5em" height="1.5em" color='white'></Globe>
            </a>
        </div>
            <nav className="w-full hidden top-0 sticky p-2 py-8 px-10  items-center justify-between">
                <a href="/">
                    <GeminiIcon></GeminiIcon>
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
             
            {error && <div className="text-red-500 sr-only text-center">{error}</div>}
            <section className="w-full h-full overflow-y-auto flex flex-col gap-5 ">
            <div className='p-9'>
            <h1 className='text-4xl text-[#E4E4E4] font-semibold'>CMS</h1>
            </div>
            <section className="w-full h-full  flex justify-center  items-center  flex-wrap" style={{gap: "44px 24px"}}>
            {userApps.map((app) => (
    <div key={app.$id} className="flex flex-col gap-2 sr-only">
        <div className='flex size-full bg-[#0A0A0A] md:h-[550px] md:w-[400px]'>

        </div>
        <a href={`${app.$id}/builder`}> {/* Modifier ici pour rediriger vers /builder */}
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#0A0A0A] h-[50px]">
                    {/* Placeholder pour l'icône de l'application */}
                </div>
                <div className="flex flex-col gap-1">
                <h2 className="text-1xl font-semibold text-[#E4E4E4]">
                    {app.name}
                </h2>
                <h2 className='text-1xl font-semibold text-[#888]'>
                Shop shoes, clothing, & sports
                </h2>
                </div>
            </div>
        </a>
    </div>
))}
            <div className="rounded-[12px] border p-1 border-[#222] w-[80%] h-auto">
                <table className='border-collapse text-[#E4E4E4] w-full rounded-[12px]'>
                    <thead className=' w-full rounded-[12px]'>
                        <tr className='border-b border-[#222]'>
                            <td className="p-2  font-semibold">Files</td>
                            <td className="p-2  font-semibold">Types</td>
                            <td className="p-2  font-semibold">URL</td>
                            <td className="p-2  font-semibold">Created at</td>
                        </tr>
                    </thead>
                    <tbody className="w-full">
                     <tr className=''>
                     <td className="p-2  font-semibold flex gap-2 items-center">
                        <div className='h-[40px] w-[40px] rounded-[12px] border border-[#111]'>
                        <img src="/icons/Netflix logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                        </div>
                        <p className="font-semibold">Netflix clone logo</p>
                     </td>
                            <td className="p-2  font-semibold">Types</td>
                            <td className="p-2  font-semibold">URL</td>
                            <td className="p-2  font-semibold">Created at</td>
                     </tr>
                    </tbody>
                </table>
            </div>

                {/* Si aucune application n'est trouvée, afficher un message */}
                {userApps.length === 0 && (
                    <div className="text-gray-500 text-center">
                        Aucune application trouvée. Créez votre première application !
                    </div>
                )}
            </section>
            </section>

            {/* Modal pour entrer le nom de l'application */}
            {isModalOpen && (
                <div className="fixed transition-all duration-600 top-0 left-0 w-full h-full  bg-opacity-50 flex items-center justify-center">
                    <div className="bg-[#000] flex justify-center items-center flex-col gap-2 text-[#E4E4E4] absolute bottom-0 h-[60%] w-full border rounded-b-none border-[#111] p-8 rounded-[24px]">
                        <div className="flex flex-col py-2 w-[300px]">
                        <h2 className="text-2xl font-bold mb-4">Create a new app</h2>
                        {error && <p className="text-red-500 hidden mb-2">{error}</p>}
                        <input
                            type="text"
                            placeholder="App name"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="w-full p-2 border border-[#222] bg-[#0A0A0A] rounded-[12px] mb-4"
                        />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-[#111] absolute top-4 left-6 text-gray-700 p-1 h-[35px] w-[35px] flex items-center justify-center rounded-full mr-2"
                            >
                                <X color='#E4E4E4'></X>
                            </button>
                            <button
                                onClick={handleCreateApp}
                                className="bg-white text-[#000] font-semibold w-[300px] py-2 px-4 rounded-[25px]"
                            >
                                Create
                            </button>
                            <div className="absolute not-md:overflow-x-auto bottom-4 md:w-[700px] flex f justify-center">
                                <div className="md:w-auto w-full not-md:overflow-x-auto flex md:ml-100 items-center justify-center gap-5">
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/ChatGPT logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Netflix logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Spotify logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Threads logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Snapchat logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/TikTok logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Instagram logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Headspace logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                <div className='h-[50px] w-[50px] rounded-[12px] border border-[#111]'>
                                    <img src="/icons/Uber Eats logo.png" className='h-full w-full object-cover rounded-[12px]' alt="" />
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default CMS;