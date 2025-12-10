'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { fetchFolders, downloadFolderApi, FolderResponse } from "@/api/services/reglageServices";
import Image from "next/image";

export default function ExportImagesPage() {
    const [folders, setFolders] = useState<FolderResponse[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>('Tous');
    const [isDownloading, setIsDownloading] = useState(false);

    const loadFolders = async () => {
        try {
            const res = await fetchFolders();
            if (res.statusCode === 200 && res.data) {
                setFolders(res.data);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des dossiers :", err);
        }
    };

    useEffect(() => {
        loadFolders();
    }, []);

    const handleDownload = async (folder?: string) => {
        const targetFolder = folder || selectedFolder;
        if (!targetFolder) return;

        try {
            setIsDownloading(true);
            const res = await downloadFolderApi(targetFolder);

            if (res.statusCode === 200 && res.data?.zipUrl) {
                window.open(res.data.zipUrl, "_blank");
            } else {
                console.error("Erreur lors de la récupération du fichier zip :", res.message);
            }
        } catch (err) {
            console.error("Erreur lors du téléchargement :", err);
        } finally {
            setIsDownloading(false);
        }
    };

    // Crée une liste avec le dossier “Tous” en première position
    const foldersWithAll = [{ name: 'Tous', fileCount: folders.reduce((sum, f) => sum + f.fileCount, 0) }, ...folders];

    return (
        <div className="container mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6">Exportation des images</h1>

            {/* Overlay pour bloquer l'interaction pendant le téléchargement */}
            {isDownloading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-700" />
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {foldersWithAll.map((f) => (
                    <Card key={f.name} className="flex flex-col items-center p-4 border-none">
                        <div className="relative w-full flex justify-center">
                                <Image
                                src="/logos/folder.svg"
                                alt={f.name}
                                width={96}  // correspond à w-24
                                height={96} // correspond à h-24
                                className="object-contain"
                            />
                            <Button
                                onClick={() => handleDownload(f.name)}
                                disabled={isDownloading}
                                variant="ghost"
                                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
                            >
                                {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                            </Button>
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-medium">{f.name} ({f.fileCount})</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
