import { VehicleType } from "../AllTypes";

export interface VehicleRequest {
  id?: string; // UUID facultatif (présent uniquement en mise à jour)
  name: string; // Nom du véhicule
  brand: string; // Marque
  model: string; // Modèle
  capacity: number; // Capacité (en nombre de passagers)
  fuel: string; // Type de carburant
  color: string; // Couleur
  registration: string; // Numéro d'immatriculation
  licensePlate: string; // Plaque d'immatriculation
  serialNumber: string; // Numéro de série
  type: VehicleType; // Type de véhicule (enum)
  partnerId: string; // UUID du partenaire associé
  file?: any; // Fichier joint (image, document, etc.) optionnel
}
