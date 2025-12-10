'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteProductImages } from '@/api/services/productServices';

interface ProductImagesManagerProps {
    productId?: string; // ✅ rendu optionnel
    mainImageUrl?: string | null;
    additionalImages: string[];
    onImagesDeleted?: () => void;
}

export const ProductImagesManager: React.FC<ProductImagesManagerProps> = ({ productId,mainImageUrl, additionalImages, onImagesDeleted, }) => {

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const allImages = [
        ...(mainImageUrl ? [mainImageUrl] : []),
        ...(additionalImages ?? []),
    ];

    // ✅ Sélection / désélection d'une image
    const handleSelect = (imageUrl: string) => {
        setSelectedImages((prev) =>
            prev.includes(imageUrl)
                ? prev.filter((url) => url !== imageUrl)
                : [...prev, imageUrl]
        );
    };

    // ✅ Suppression des images sélectionnées
    const handleDeleteSelectedImages = async () => {

        if (!productId) {
            toast.error('Identifiant du produit introuvable');
            return;
        }

        if (selectedImages.length === 0) {
            toast.warning('Veuillez sélectionner au moins une image à supprimer');
            return;
        }

        try {
            setLoading(true);

            const res = await deleteProductImages(productId, selectedImages);
            if (res.statusCode !== 200) {
                toast.error(res.message || 'Erreur lors de la suppression');
            } else {
                toast.success(res.message || 'Images supprimées avec succès');
                setSelectedImages([]);
                onImagesDeleted?.();
            }

        } catch (error: any) {
            
            toast.error('Impossible de supprimer les images');
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des images</CardTitle>
            </CardHeader>
            <CardContent>
                {allImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* ✅ Image principale à gauche */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Image principale</h3>
                            {mainImageUrl ? (
                                <div className="relative w-40 h-40 rounded-md overflow-hidden shadow">
                                    <Image
                                        src={mainImageUrl}
                                        alt="Image principale"
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                        unoptimized
                                    />
                                    <div className="absolute top-2 left-2 bg-white rounded p-1 shadow">
                                        <Checkbox
                                            checked={selectedImages.includes(mainImageUrl)}
                                            onCheckedChange={() => handleSelect(mainImageUrl)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">Aucune image principale</p>
                            )}
                        </div>

                        {/* ✅ Autres images à droite */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Autres images</h3>
                            {additionalImages.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {additionalImages.map((img, index) => (
                                        <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden shadow">
                                            <Image
                                                src={img}
                                                alt={`Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                loading="lazy"
                                                unoptimized
                                            />
                                            <div className="absolute top-2 left-2 bg-white rounded p-1 shadow">
                                                <Checkbox
                                                    checked={selectedImages.includes(img)}
                                                    onCheckedChange={() => handleSelect(img)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">Aucune autre image disponible</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center">Aucune image à afficher.</p>
                )}

                {/* ✅ Bouton de suppression */}
                <div className="flex justify-end mt-6">
                    <Button
                        variant="destructive"
                        disabled={loading || selectedImages.length === 0}
                        onClick={handleDeleteSelectedImages}
                    >
                        {loading ? 'Suppression...' : `Supprimer (${selectedImages.length})`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
