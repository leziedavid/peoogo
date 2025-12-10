// app/aide-assistance/page.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, User, Tag, Store, MessageCircle, HelpCircle, Users, Phone, Shield, Truck, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { Footer } from '@/components/home/Footer';
import Chat from "@/components/chat/Chat";
import EAgriMenu from "@/components/market/EAgriMenu";

export default function AideAssistancePage() {

    const [activeSection, setActiveSection] = useState("home");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState('');

    const [lastOrderId] = useState(''); // Simuler un ID de commande
    const [openChate, setOpenChate] = useState(false);

    const handleQuestionSelect = (question: string) => {
        console.log(question);
        setSelectedQuestion(question);
        setOpenChate(true);
        console.log(openChate);

    };


    const faqItems = [
        {
            question: "La plateforme Peoogo est-elle fiable ?",
            answer: "Oui, Peoogo est une plateforme sécurisée qui utilise les dernières technologies de cryptage pour protéger vos données et transactions. Nous vérifions tous nos vendeurs et garantissons la qualité des produits."
        },
        {
            question: "Quelles sont les garanties offertes par Peoogo ?",
            answer: "Nous offrons une garantie de satisfaction à 100%, un système de remboursement en cas de problème, et un service client disponible 24h/24 pour résoudre tous vos problèmes."
        },
        {
            question: "Comment créer un compte vendeur ?",
            answer: "Pour devenir vendeur sur Peoogo, cliquez sur 'Se connecter', puis 'Créer un compte vendeur'. Remplissez vos informations, ajoutez vos documents d'identification et attendez la validation de votre compte."
        },
        {
            question: "Quels sont les modes de paiement acceptés ?",
            answer: "Nous acceptons les paiements par carte bancaire, Mobile Money (Orange Money, MTN Money, Moov Money), virements bancaires et paiements à la livraison selon les régions."
        },
        {
            question: "Comment fonctionne la livraison ?",
            answer: "La livraison est assurée par nos partenaires logistiques. Les délais varient de 24h à 7 jours selon votre localisation et le type de produit. Vous recevez un SMS de suivi pour chaque étape."
        },
        {
            question: "Puis-je annuler ma commande ?",
            answer: "Oui, vous pouvez annuler votre commande dans les 2h suivant la validation, directement depuis votre espace client. Après ce délai, contactez notre service client."
        }
    ];

    const aideItems = [
        {
            icon: <Store className="w-8 h-8 text-[#B07B5E]" />,
            text: "Elle présente les offres de ventes ou d'achats.",
            label: "Place du marché",
        },
        {
            icon: <Tag className="w-8 h-8 text-[#B07B5E]" />,
            text: "Montre les tendances actualisées des prix des différents produits agricoles ou halieutiques dans les localités.",
            label: "Prix du marché",
        },
        {
            icon: <User className="w-8 h-8 text-[#B07B5E]" />,
            text: "Il permet d'accéder au répertoire des publications et autres…",
            label: "Espace utilisateur",
        },
        {
            icon: <ShoppingCart className="w-8 h-8 text-[#B07B5E]" />,
            text: "Ce menu permet de consulter les produits ajoutés à son panier d'achat avant de finaliser sa commande.",
            label: "Panier d'achat",
        },
    ];

    const assistanceItems = [
        {
            icon: <User className="w-8 h-8 text-[#B07B5E]" />,
            text: "Pour toute question, contactez notre support client disponible 24h/24 et 7j/7.",
            label: "Support client",
        },
        {
            icon: <ShoppingCart className="w-8 h-8 text-[#B07B5E]" />,
            text: "Assistance pour le suivi de vos commandes et de vos paiements.",
            label: "Assistance client",
        },
    ];

    const questionsCoursantesItems = [
        {
            icon: <HelpCircle className="w-8 h-8 text-[#B07B5E]" />,
            text: "Comment créer un compte sur Peoogo et commencer à vendre ou acheter ?",
            label: "Création de compte",
        },
        {
            icon: <CreditCard className="w-8 h-8 text-[#B07B5E]" />,
            text: "Quels sont les modes de paiement acceptés sur la plateforme ?",
            label: "Modes de paiement",
        },
        {
            icon: <Shield className="w-8 h-8 text-[#B07B5E]" />,
            text: "Comment garantir la sécurité de mes transactions sur Peoogo ?",
            label: "Sécurité transactions",
        },
        {
            icon: <Truck className="w-8 h-8 text-[#B07B5E]" />,
            text: "Comment fonctionne la livraison et quels sont les délais ?",
            label: "Livraison",
        },
    ];

    const questionsActeursItems = [
        {
            icon: <Users className="w-8 h-8 text-[#B07B5E]" />,
            text: "Comment optimiser vos ventes et gérer votre boutique en ligne ?",
            label: "Questions vendeurs",
        },
        {
            icon: <ShoppingCart className="w-8 h-8 text-[#B07B5E]" />,
            text: "Guide d'achat, conseils pour bien choisir vos produits agricoles.",
            label: "Questions acheteurs",
        },
        {
            icon: <Store className="w-8 h-8 text-[#B07B5E]" />,
            text: "Solutions pour les coopératives et groupements d'agriculteurs.",
            label: "Questions coopératives",
        },
        {
            icon: <Truck className="w-8 h-8 text-[#B07B5E]" />,
            text: "Informations spécialisées pour les transporteurs et livreurs.",
            label: "Questions transporteurs",
        },
    ];

    if (activeSection === "home") {
        return (
            <>
                <EAgriMenu />
                <div className={`min-h-[calc(100vh_-_56px)] px-3 lg:px-6`}>

                    <div className="max-w-4xl mx-auto p-6">
                        {/* Icône principale */}
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-[#B07B5E] rounded-full flex items-center justify-center">
                                <HelpCircle className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        {/* Titre principal */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                Centre d'Aide Peoogo
                            </h1>
                            <p className="text-xl text-gray-600">
                                Bonjour ! Comment pouvons-nous vous aider aujourd'hui sur Peoogo ?
                            </p>
                        </div>

                        {/* Boutons principaux - 4 boutons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                            <button
                                onClick={() => setActiveSection("aide")}
                                className="bg-[#B07B5E] text-white p-4 rounded-lg text-base font-medium hover:bg-[#8B6647] transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <HelpCircle className="w-5 h-5" />
                                Aide
                            </button>
                            <button
                                onClick={() => setActiveSection("assistance")}
                                className="bg-white text-gray-700 p-4 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-200"
                            >
                                <Phone className="w-5 h-5" />
                                Assistance
                            </button>
                            <button
                                onClick={() => setActiveSection("questions-courantes")}
                                className="bg-white text-gray-700 p-4 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-200"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Questions courantes sur Peoogo
                            </button>
                            <button
                                onClick={() => setActiveSection("questions-acteurs")}
                                className="bg-white text-gray-700 p-4 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-200"
                            >
                                <Users className="w-5 h-5" />
                                Questions par acteurs
                            </button>
                        </div>

                        {/* Section FAQ */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <MessageCircle className="w-8 h-8 text-[#B07B5E]" />
                                    Questions courantes sur Peoogo
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="p-6">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            className="w-full text-left flex items-center justify-between gap-4 hover:text-[#B07B5E] transition-colors duration-200"
                                        >
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {item.question}
                                            </h3>
                                            {expandedFaq === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="mt-4 text-gray-600 leading-relaxed">
                                                {item.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section contact */}
                        <div className="mt-12 bg-gradient-to-r from-[#B07B5E] to-[#8B6647] rounded-lg p-8 text-white text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Besoin d'aide supplémentaire ?
                            </h2>
                            <p className="mb-6 opacity-90">
                                Notre équipe est là pour vous accompagner
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="bg-white text-[#B07B5E] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Nous contacter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Section Aide
    if (activeSection === "aide") {
        return (
            <>
                <EAgriMenu />
                <div className="min-h-[calc(100vh_-_56px)] py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto p-6">
                        <button
                            onClick={() => setActiveSection("home")}
                            className="mb-6 text-[#B07B5E] hover:text-[#8B6647] transition-colors duration-200 flex items-center gap-2"
                        >
                            ← Retour au centre d'aide
                        </button>

                        <h1 className="text-3xl font-bold text-gray-800 mb-8">
                            Aide
                        </h1>

                        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                            {aideItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#B07B5E]/20 cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-[#B07B5E]/10 p-4 rounded-lg group-hover:bg-[#B07B5E]/20 transition-colors duration-300">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#B07B5E] transition-colors duration-300">
                                                {item.label}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Section Assistance
    if (activeSection === "assistance") {
        return (
            <>
                <EAgriMenu />
                <div className="min-h-[calc(100vh_-_56px)] py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto p-6">
                        <button
                            onClick={() => setActiveSection("home")}
                            className="mb-6 text-[#B07B5E] hover:text-[#8B6647] transition-colors duration-200 flex items-center gap-2"
                        >
                            ← Retour au centre d'aide
                        </button>

                        <h1 className="text-3xl font-bold text-gray-800 mb-8">
                            Assistance
                        </h1>

                        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                            {assistanceItems.map((item, index) => (
                                <div key={index} onClick={() => handleQuestionSelect(item.label)} className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#B07B5E]/20 cursor-pointer" >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-[#B07B5E]/10 p-4 rounded-lg group-hover:bg-[#B07B5E]/20 transition-colors duration-300">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#B07B5E] transition-colors duration-300">
                                                {item.label}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />

                {openChate && (
                    <Chat
                        onClose={() => setOpenChate(false)}
                        isOpen={openChate}
                        question={selectedQuestion}
                        lastOrderId={lastOrderId}
                    />
                )}
            </>
        );
    }

    // Section Questions courantes
    if (activeSection === "questions-courantes") {
        return (
            <>
                <EAgriMenu />
                <div className="min-h-[calc(100vh_-_56px)] py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto p-6">
                        <button
                            onClick={() => setActiveSection("home")}
                            className="mb-6 text-[#B07B5E] hover:text-[#8B6647] transition-colors duration-200 flex items-center gap-2"
                        >
                            ← Retour au centre d'aide
                        </button>

                        <h1 className="text-3xl font-bold text-gray-800 mb-8">
                            Questions courantes sur Peoogo
                        </h1>

                        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                            {questionsCoursantesItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#B07B5E]/20 cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-[#B07B5E]/10 p-4 rounded-lg group-hover:bg-[#B07B5E]/20 transition-colors duration-300">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#B07B5E] transition-colors duration-300">
                                                {item.label}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Section Questions par acteurs
    return (
        <>
            <EAgriMenu />
            <div className="min-h-[calc(100vh_-_56px)] py-20 bg-gray-50">

                <div className="max-w-4xl mx-auto p-6">
                    <button
                        onClick={() => setActiveSection("home")}
                        className="mb-6 text-[#B07B5E] hover:text-[#8B6647] transition-colors duration-200 flex items-center gap-2"
                    >
                        ← Retour au centre d'aide
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        Questions par acteurs
                    </h1>

                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {questionsActeursItems.map((item, index) => (
                            <div key={index} className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#B07B5E]/20 cursor-pointer"  >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 bg-[#B07B5E]/10 p-4 rounded-lg group-hover:bg-[#B07B5E]/20 transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#B07B5E] transition-colors duration-300">
                                            {item.label}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </>
    );
}