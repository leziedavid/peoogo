'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/form/ProductForms';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteProduct, getProducteurProductsByCode, getProducteurProductStats, getUserEnrollementDataByCode } from '@/api/services/productServices';
import { UserEnrollementData } from '@/types/ApiReponse/userEnrollementData';
import { toast } from "sonner";
import { Decoupage, Product } from '@/types/ApiReponse/ProduitsResponse';
import { DataTable } from '@/components/table/dataTable';
import { columns as ProductColumns } from "@/types/columns/product-columns";
import DashboardProduct from '@/components/dash/DashboardProduct';
import { StatistiquesDesProduitsResponse } from '@/types/ApiReponse/StatistiquesDesProduitsResponse';
import DeleteDialog from '@/components/Dialog/DeleteDialog';
import { ProductsRequest } from '@/types/ApiRequest/ProductsRequest';


export default function Page() {

    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState<'liste' | 'ajout'>('liste');
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [userEnrollementData, setUserEnrollementData] = useState<UserEnrollementData | null>(null);
    const [initialValues, setInitialValues] = useState<ProductsRequest | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    // pour la supression
    const [deleteDialog, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<Product | null>(null); // Corrigé le nom de la variable
    const [statistique, setStatistique] = useState<StatistiquesDesProduitsResponse | null>(null);


    const fechproductsByCode = async () => {

        const res = await getProducteurProductsByCode(code.trim(), currentPage, limit);
        if (res.statusCode === 200 && res.data) {
            setProducts(res.data.data);
            setTotalItems(res.data.total);
            setCurrentPage(res.data.page);
            toast.success(res.message);
            console.log("Données des produits récupérées avec succès :", res.data);
        } else {
            toast.error(res.message);
            // console.error("Erreur lors de la récupération des données d'enrôlement :", res.message);
        }
    };

    // code,
    useEffect(() => {
        fechproductsByCode();
    }, [currentPage]);

    const fechstatBycodeusers = async () => {
        const res = await getProducteurProductStats(code.trim());
        if (res.statusCode === 200 && res.data) {
            setStatistique(res.data);
            // toast.success(res.message);
            console.log("Données des produits récupérées avec succès :", res.data);
        } else {
            // toast.error(res.message);
            // console.error("Erreur lors de la récupération des données d'enrôlement :", res.message);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleVerifyCode = async () => {
        // Simule une API
        const res = await getUserEnrollementDataByCode(code.trim());
        if (res.statusCode === 200 && res.data) {
            fechproductsByCode();
            fechstatBycodeusers();
            setIsVerified(true);
            setUserEnrollementData(res.data);
            toast.success(res.message);
            console.log("Données d'enrôlement récupérées avec succès :", res.data);
        } else {
            toast.error(res.message);
            // console.error("Erreur lors de la récupération des données d'enrôlement :", res.message);
        }
    };


    const ChangeTabs = (tab: 'liste' | 'ajout') => {
        setActiveTab(tab);
        setInitialValues(null);
        fechproductsByCode();
        fechstatBycodeusers();
    };

    // Gestion des actions (peut-être adapté selon ta logique)
    function handleChangeState(row: any, newStates: string[]) {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    }

    function handleUpdate(row: any) {
        // On construit un objet propre qui respecte ProductsRequest (sans images)
        const productUpdateData: Omit<ProductsRequest, "images" | "autre_images"> = {
            id: row.id ?? "",
            categorie: row.categories?.map((cat: { id: string }) => cat.id) ?? [],
            nom: row.nom ?? "",
            paymentMethod: row.paymentMethod ?? "",
            unite: row.unite ?? "",
            quantite: row.quantite ?? 0,
            prixUnitaire: row.prixUnitaire ?? 0,
            prixEnGros: row.prixEnGros ?? 0,
            saleType: row.saleType ?? "",
            typeActeur: row.typeActeur ?? ("" as any), // si tu n'es pas sûr du type
            disponibleDe: row.disponibleDe ?? "",
            disponibleJusqua: row.disponibleJusqua ?? "",
            description: row.description ?? "",
            decoupage: row.decoupage ?? {} as Decoupage,
            imageUrl: row.imageUrl ?? undefined, // utile si tu veux pré-afficher
            allimages: row.allimages ?? [],      // idem
        };

        setInitialValues(productUpdateData);
        setActiveTab('ajout');
    }


    function handleDelete(row: any) {
        setSelectedId(row.id);
        setDialogOpen(true);
    }

    const handleDeleteClick = async (id: string): Promise<void> => {

        const result = await deleteProduct(id);
        if (result.statusCode !== 200) {
            toast.error(result.message);
            fechproductsByCode();
            fechstatBycodeusers();
        } else {
            toast.success("Produit supprimé avec succès !");
            setDeleteDialogOpen(false);
            fechproductsByCode();
            fechstatBycodeusers();
        }
    };

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    }

    return (
        <>
            <div className="w-full overflow-x-auto">

                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                    Mon espaces de production {userEnrollementData?.user.generatedCode}
                </div>

                {isVerified && (
                    <DashboardProduct
                        userName={userEnrollementData?.user.name ?? "Producteur"}
                        onChangeTab={ChangeTabs}
                        activeTab={activeTab}
                        statistique={statistique}
                    />
                )}

                <div className="flex justify-center items-center">
                    {!isVerified ? (
                        <>
                            <Card className="w-full max-w-md shadow-lg mt-6">
                                <CardHeader>
                                    <CardTitle className="text-center text-[#B07B5E] uppercase">Identification Producteur</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div>
                                        <label className="font-medium text-sm">CODE PRODUCTEUR</label>
                                        <Input placeholder="Entrer le code" value={code} onChange={(e) => setCode(e.target.value)} />
                                    </div>
                                    <Button onClick={handleVerifyCode} className="w-full bg-[#B07B5E] hover:bg-[#045d28] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200" >
                                        Vérifier
                                    </Button>
                                </CardContent>
                            </Card>
                        </>

                    ) : (

                        <>

                            <div className="w-full px-4 md:px-10 max-w-6xl ">
                                {/* Contenu selon l'onglet actif */}
                                {activeTab === 'liste' && (
                                    <div>
                                        <h1 className="text-xl font-bold mb-4">LISTE DES PRODUITS</h1>

                                        <DataTable
                                            columns={ProductColumns}
                                            data={products}
                                            onChangeState={handleChangeState}
                                            onUpdateData={handleUpdate}
                                            onDeleteData={handleDelete}
                                            onNextPage={handleNextPage}          // optionnel : gère la page suivante
                                            onPreviousPage={handlePreviousPage}  // optionnel : gère la page précédente
                                            currentPage={currentPage}
                                            totalItems={totalItems}
                                            itemsPerPage={limit}
                                        />
                                    </div>
                                )}

                                {activeTab === 'ajout' && (
                                    <div className="mt-6">
                                        <ProductForm
                                            initialValues={initialValues ?? undefined}
                                            userEnrollementData={userEnrollementData ?? null}
                                            fechproductsByCode={fechproductsByCode}
                                            setActiveTab={setActiveTab}
                                            codeUsers={code.trim()}
                                        />
                                    </div>
                                )}
                            </div>

                        </>

                    )}
                </div>

                <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />

            </div>
        </>
    );

}
