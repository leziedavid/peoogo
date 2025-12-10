// src/interfaces/contactResponse.ts
export type ContactObjet =
    | 'achat_produits'
    | 'vente_produits'
    | 'formation_agricole'
    | 'financement_agricole'
    | 'equipements_agricoles'
    | 'conseil_technique'
    | 'certification_bio'
    | 'transformation_produits'
    | 'marche_producteurs'
    | 'innovation_agricole'
    | 'partenariat_cooperatives'
    | 'assurance_agricole'
    | 'autre';

export interface ContactResponse {
    id: string;
    nomPrenom: string;
    email: string;
    phone: string;
    job_title: string;
    company_name: string;
    objets: ContactObjet;   // string union
    contents: string;
    source?: string;
    timestamp: string;
}
