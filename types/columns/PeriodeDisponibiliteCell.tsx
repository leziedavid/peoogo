import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProductAvailability } from "@/api/services/productServices";
import { toast } from "sonner";

export function PeriodeDisponibiliteCell({ row }: { row: any }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(row.original.disponibleDe);
    const [endDate, setEndDate] = useState(row.original.disponibleJusqua);

    const handleSave = async () => {
        try {
            console.log("Nouvelles dates :", startDate, endDate);
            // TODO: Appel API pour mettre à jour
            await updateProductAvailability(row.original.id, startDate, endDate);
            setIsModalOpen(false);
            toast.success("Les dates de disponibilité ont bien été mises à jour");
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    return (
        <>
            <span onClick={() => setIsModalOpen(true)} className="cursor-pointer text-[#B07B5E] hover:text-green-800 " >
                {formatDate(row.original.disponibleDe)} → {formatDate(row.original.disponibleJusqua)}
            </span>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier la période de disponibilité</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Disponible de :</label>
                            <Input  type="date" value={startDate.split("T")[0]} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Disponible jusqu'à :</label>
                            <Input type="date"  value={endDate.split("T")[0]} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}

// Utilitaire de formatage
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
}
