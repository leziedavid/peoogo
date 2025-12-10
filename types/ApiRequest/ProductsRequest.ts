// ProductRequest.ts
import { Decoupage, TypeCompte } from "./EnrollementRequest";
export interface ProductsRequest {
    id?: string;
    categorie: string[];
    nom: string;
    paymentMethod: string;
    unite: string;
    quantite: number;
    prixUnitaire: number;
    prixEnGros: number;
    saleType: string;
    typeActeur: TypeCompte; // ou string si ce n’est pas encore strictement typé
    disponibleDe: string; // Format ISO ou format YYYY-MM-DD
    disponibleJusqua: string;   // idem
    description: string;
    images?: File;         // ⬅️ maintenant optionnel
    autre_images?: File[];   // ⬅️ maintenant optionnel
    decoupage: Decoupage;
    imageUrl?: string;
    allimages?: string[];
}
