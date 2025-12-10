
'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import EnrollementForm from '@/components/form/EnrollementForm';
import { getUserName, getUserRole, isSessionStillValid } from '@/app/middleware';
// import EnrollementLogin from '@/components/form/EnrollementLogin';
import { getPaginatedByAgent } from '@/api/services/enrollementsServices';
import { EnrollementData } from '@/types/ApiReponse/enrollementControleResponse';
import { EnrollementRequest } from '@/types/ApiRequest/EnrollementRequest';
import RelaisForm from '@/components/form/RelaisForm';
import { useRouter } from 'next/navigation';
const Page = () => {

    const [activeTab, setActiveTab] = useState('FORMULAIRE');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [UserName, setUserName] = useState("");
    const [UserRole, setUserRole] = useState("");
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [loginStateChange, setLoginStateChange] = useState(false); // Pour écouter les changements
    const [listes, setListes] = useState<EnrollementData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [selectedEnrollement, setSelectedEnrollement] = useState<EnrollementRequest | null>(null);

    const tabs = [
        { id: 'ENROLEMENT REJETER', label: 'ENROLEMENT REJETER', badge: 3 },
        { id: 'FORMULAIRE', label: 'FORMULAIRE', badge: null },
        { id: 'RELAIS ET POINTS FAUCAUX', label: 'RELAIS ET POINTS FAUCAUX', badge: null },
    ];

    const checkUserInfo = async () => {
        let verif = await isSessionStillValid();
        console.log("Session valid:", verif);

        if (!verif) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }

        const user = await getUserName();
        if (user) {
            setUserName(user);
        }

        const role = await getUserRole();
        if (role) {
            setUserRole(role);
        }
    };

    useEffect(() => { checkUserInfo() }, [loginStateChange]);

    const handleLoginSuccess = () => {
        setLoginStateChange(!loginStateChange); // Déclenche une revalidation
    };

    const handleGetByAgent = async () => {
        setLoading(true);
        const data = await getPaginatedByAgent(currentPage, limit);
        if (data.statusCode === 200) {
            setListes(data?.data?.data ?? []);
            setTotalItems(data?.data?.total ?? 0);
            setCurrentPage(data?.data?.page ?? 1);
            setLoading(false);
        } else {
            setLoading(false);
            setListes([]);
        }
    }

    useEffect(() => {
        handleGetByAgent();
    }, [currentPage]);

    // Fonction appelée au clic
    const handleSelectEnrollement = (enrolement: any) => {
        // On extrait et forme l'objet EnrollementRequest
        const formatted: EnrollementRequest = {
            id: enrolement.id,
            agent_superviseur_id: enrolement.agent_superviseur_id ?? "",
            status_dossier: enrolement.status_dossier,
            time_enrolment: enrolement.time_enrolment,
            nom: enrolement.nom,
            prenom: enrolement.prenom,
            // datedenaissance: new Date(enrolement.datedenaissance).toISOString(),
            datedenaissance: enrolement.datedenaissance,
            lieudenaissance: enrolement.lieudenaissance,
            sexe: enrolement.sexe,
            nationalit: enrolement.nationalit ?? "",
            situationmatrimoniale: enrolement.situationmatrimoniale ?? "",
            niveaudinstruction: enrolement.niveaudinstruction,
            numroprincipal: enrolement.numroprincipal,
            site: enrolement.site ?? "",
            languelocaleparle: enrolement.languelocaleparle ?? "",
            autreslanguelocaleparle: enrolement.autreslanguelocaleparle,
            campementquartier: enrolement.campementquartier,
            coordonneesgeo: enrolement.coordonneesgeo,
            activitprincipaleId: enrolement.activitprincipaleId,
            spculationprincipaleId: enrolement.spculationprincipaleId,
            autresactivite: enrolement.autresActivites?.map((a: any) => a.activite?.id) || [],
            autresspeculation: enrolement.autresSpeculations?.map((s: any) => s.speculation?.id) || [],
            superficiedevotreparcellecultu: enrolement.superficiedevotreparcellecultu,
            indiquezlasuperficieenha: enrolement.indiquezlasuperficieenha,
            quantitproduction: enrolement.quantitproduction,
            prcisezlenombre: enrolement.prcisezlenombre,
            moyendestockage: enrolement.moyendestockage,
            typeCompte: enrolement.TypeCompte, // ou autre champ selon ta source
            decoupage: {
                districtId: enrolement.decoupage?.district?.id,
                regionId: enrolement.decoupage?.region?.id,
                departmentId: enrolement.decoupage?.department?.id,
                sousPrefectureId: enrolement.decoupage?.sousPrefecture?.id,
                localiteId: enrolement.decoupage?.localite?.id,
            },
            photo: null, // ici tu peux gérer les fichiers si tu les as
            photo_document_1: null,
            photo_document_2: null,
        };
        setSelectedEnrollement(formatted);
        setActiveTab('FORMULAIRE');
    };

    const renderTabContent = () => {
        switch (activeTab) {

            case 'ENROLEMENT REJETER':
                return (
                    <div className="bg-white rounded-lg p-6">
                        <h3 className="text-lg text-[#B07B5E] font-semibold  mb-4">Enrôlements Rejetés</h3>
                        <p className=" mb-4">Liste des enrôlement rejetées.</p>
                        <div className="space-y-3">

                            {listes.map((enrolement) => {
                                const createdAt = new Date(enrolement.createdAt);
                                return (
                                    <div key={enrolement.id || enrolement.code} className="border-l-4 border-red-500 bg-red-50 p-4 rounded mb-3 cursor-pointer"
                                        onClick={() => handleSelectEnrollement(enrolement)}>
                                        <h4 className="font-medium text-red-800">{enrolement.code}</h4>
                                        <p className="text-sm text-red-600"> {enrolement.status_dossier ?? "Statut inconnu"} / {enrolement.commentaire_controle ?? "Aucun commentaire"}</p>
                                        {/* commentaire_controle */}
                                        <p className="text-sm text-red-600">
                                            {createdAt.toLocaleDateString()} -{" "}
                                            {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                );
            case 'FORMULAIRE':

                return (
                    <div className=""> <EnrollementForm initialValues={selectedEnrollement || {}} setActiveTab={setActiveTab} /> </div>
                );
            case 'RELAIS ET POINTS FAUCAUX':
                return (<div className=""> <RelaisForm /> </div>);
            default:
                return null;
        }
    };

    // 🛡️ Affichage de l'écran de garde si pas connecté
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col text-center p-4">
                {/* Nom de l'application */}
                <h1 className="text-4xl font-bold text-[#B07B5E] mb-4">App Collecte</h1>
                <p className="text-sm text-gray-600 mb-6">Votre outil de suivi terrain</p>

                <img src="/collecte.svg" alt="Verrouillé" className="w-40 h-40 mb-6" />
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                    Vous devez vous connecter pour accéder au formulaire
                </h2>
                <p className="text-gray-500 mb-4">
                    Veuillez cliquer sur le bouton ci-dessous pour vous connecter avec votre code d'enrôlement.
                </p>
                <button onClick={() => router.push('/auth/login')} className="text-white bg-[#B07B5E] hover:bg-green-700 font-medium rounded-lg text-sm px-6 py-2" >
                    Se connecter
                </button>

                {/* Modal de connexion */}
                {/* <EnrollementLogin isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} state={loginStateChange} /> */}
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-50 py-8 bg-white ">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* User Profile Card - Centered */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#B07B5E]">
                            <User size={50} className="text-gray-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{UserName}</h1>
                        <p className="text-gray-600">{UserRole}</p>
                    </div>
                </div>
                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg mb-6">
                    <div className=" border-gray-200">
                        <nav className="flex flex-wrap justify-center gap-2 p-4">
                            {tabs.map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-[#B07B5E] text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} >
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {renderTabContent()}
                </div>
            </div>

            {/* Modal connexion (au cas où l'utilisateur le referme manuellement mais veut se reconnecter) */}
            {/* <EnrollementLogin isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} state={loginStateChange} /> */}

        </div>

    );

};

export default Page;