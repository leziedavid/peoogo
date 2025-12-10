import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // ShadCN button
import { Footer } from "@/components/home/Footer";
import EAgriMenu from "@/components/market/EAgriMenu";

export default function Page() {
    return (
        <>
            <EAgriMenu />
            <div className={`min-h-[calc(100vh_-_56px)] px-3 lg:px-6`}>
                {/* Hero Section */}
                <section className="relative py-20 px-6 text-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/legumes-cereales.jpg')" }} >
                    <div className="bg-opacity-70 p-6 rounded-lg inline-block">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white animate-fadeIn">
                            Basés au Burkina Faso, nous sommes une jeune startup ambitieuse
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-white animate-fadeIn delay-200">
                            Passionnés par l&#39;innovation agricole et aquacole, nous transformons le secteur avec des solutions pratiques, accessibles et performantes.
                        </p>
                        <Button className="mt-6 animate-bounce bg-[#B07B5E] hover:bg-[#a06a50] text-white" variant="default">
                            Découvrez nos services <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>


                {/* Mission Section */}
                <section className="py-20 px-6 md:px-20 bg-white">
                    <div className="md:flex md:items-center md:gap-12">
                        <div className="md:w-1/2 animate-slideInLeft">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 uppercase">Notre mission</h2>
                            <p className="text-gray-700 mb-4">
                                Nous rassemblons tous les acteurs de la chaîne vivrière et aquacole autour d’une plateforme digitale de services. Notre objectif est de faciliter les échanges, optimiser les activités et renforcer la collaboration.
                            </p>
                            <p className="text-gray-700">
                                Rejoignez-nous et faites partie de la révolution digitale agricole au Burkina Faso !
                            </p>
                        </div>
                        <div className="md:w-1/2 mt-8 md:mt-0 relative animate-slideInRight">
                            <Image
                                src="/legumes-cereales.jpg"
                                alt="Agriculture et aquaculture"
                                width={500}
                                height={400}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 px-6 md:px-20 bg-[#B07B5E]/10">
                    <h2 className="text-3xl font-bold text-green-900 text-center uppercase mb-12 animate-fadeIn">
                        Nos principaux bénéfices
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 animate-fadeIn delay-100">
                            <h3 className="font-semibold text-green-800 mb-2">Centralisation</h3>
                            <p className="text-gray-700">
                                Accès centralisé à des services numériques adaptés à la chaîne vivrière et aquacole.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 animate-fadeIn delay-200">
                            <h3 className="font-semibold text-green-800 mb-2">Mise en relation</h3>
                            <p className="text-gray-700">
                                Connectez facilement les acteurs clés du secteur pour renforcer la collaboration.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 animate-fadeIn delay-300">
                            <h3 className="font-semibold text-green-800 mb-2">Optimisation</h3>
                            <p className="text-gray-700">
                                Suivi et traçabilité des opérations pour plus de performance et de transparence.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
}
