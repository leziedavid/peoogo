import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProductQuantity } from "@/api/services/productServices";
import { toast } from "sonner";

export function QuantiteCell({ row }: { row: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantite, setQuantite] = useState(row.original.quantite);

    const handleSave = async () => {
        try {
            console.log("Nouvelle quantité :", quantite);
            // TODO: Appel API pour mettre à jour la quantité
            await updateProductQuantity(row.original.id, quantite);
            setIsModalOpen(false);
            toast.success("La quantité a bien été mise à jour");
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    return (
        <>
            <span onClick={() => setIsModalOpen(true)} className="cursor-pointer text-[#B07B5E] hover:underline" >
                {quantite}
            </span>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier la quantité</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nouvelle quantité :</label>
                            <Input type="number" min={0} value={quantite} onChange={(e) => setQuantite(Number(e.target.value))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}> Annuler </Button>
                        <Button onClick={handleSave}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
