'use client';

import {Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { EnrollementData } from '@/types/ApiReponse/enrollementControleResponse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { renderStatutBadge } from '../renderStatutBadge';
import { formatEstimatedArrival } from '@/lib/formatEstimatedArrival';
import Image from 'next/image';


type EnrollementProps = {
    initialValue?: EnrollementData;
    isOpen: boolean;
    onClose: () => void;
};

const DEFAULT_IMAGE_URL = '/photos_09.svg';
const DEFAULT_IMAGE_VERSO = '/documents.png';
const DEFAULT_IMAGE_RECTO = '/documents.png';


export default function DetailEnrollement({ initialValue, isOpen, onClose }: EnrollementProps) {

    const formatDate2 = (isoDate?: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // mois commence à 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    const photoUrl = initialValue?.photo || DEFAULT_IMAGE_URL;
    const document1 = initialValue?.document1 || DEFAULT_IMAGE_VERSO;
    const document2 = initialValue?.document2 || DEFAULT_IMAGE_RECTO;


    return (
        <div className={`fixed inset-0 bg-black/50 z-50 ${!isOpen && 'hidden'}`}>
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0 w-full md:w-2/3' : 'translate-x-full'} bg-white shadow-xl`}>

                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold uppercase">Detail Enrollment</h5>
                    <Button variant="ghost" onClick={onClose}><X /></Button>
                </div>


                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                {renderStatutBadge(initialValue?.status_dossier ?? '')}
                                <div className="md:col-span-1">
                                    <Label className="text-sm font-medium text-gray-700">Identifiant :</Label>
                                    <p className="text-sm text-gray-900 font-mono">{initialValue?.code}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <Label className="text-sm font-medium text-gray-700">Agent contrôleur :</Label>
                                    <p className="text-sm text-gray-900">{initialValue?.user_control?.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Documents Section */}
                            <div className="lg:col-span-1">
                                <Card className="h-[800px]">
                                    <CardHeader className="bg-gray-200 text-black rounded-t-lg">
                                        <CardTitle className="text-lg font-medium">Document(s)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 h-[calc(100%-4rem)] overflow-y-auto">
                                        <div className="p-4 space-y-6">
                                            {/* Photo d'identité */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    9. Photo l&apos;identité
                                                </Label>
                                                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
                                                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-green-100 rounded flex items-center justify-center border-2 border-dashed border-gray-300">
                                                        <Image src={photoUrl} alt="Photo du candidat" width={180} height={180} className="w-full h-full object-cover rounded " unoptimized/>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Document d'identité */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    12. Photo du document recto
                                                </Label>
                                                <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center h-64">
                                                    <Image src={document1} alt="Photo du candidat" width={180} height={180} className="w-full h-full object-cover rounded " unoptimized />
                                                </div>
                                            </div>

                                            {/* Document d'identité */}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    12. Photo du document recto
                                                </Label>
                                                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
                                                    <Image src={document2} alt="Photo du candidat" width={150} height={150} className="w-full h-full object-cover rounded " unoptimized />
                                                </div>
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Informations Section */}

                            <div className="lg:col-span-2">
                                <Card className="h-[800px]">
                                    <CardHeader className="bg-gray-200 text-black rounded-t-lg">
                                        <CardTitle className="text-lg font-medium">Informations</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 h-[calc(100%-4rem)] overflow-y-auto">
                                        <div className="space-y-6">

                                            {/* Bloc Dates et Enrôleur */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Date début */}
                                                <div>
                                                    <Label>Date et heure de début</Label>
                                                    <Input value={formatEstimatedArrival(initialValue?.start_date ?? '')} disabled className="mt-1 bg-gray-100 text-gray-600" />
                                                </div>

                                                {/* Date fin */}
                                                <div>
                                                    <Label>Date et heure de fin</Label>
                                                    <Input value={formatEstimatedArrival(initialValue?.end_date ?? '')} disabled className="mt-1 bg-gray-100 text-gray-600" />
                                                </div>

                                                {/* ID enrôleur */}
                                                <div>
                                                    <Label>Identifiant de l&apos;enrôleur</Label>
                                                    <Input value={initialValue?.agent_enroleur?.codeGenerate ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" />
                                                </div>

                                                {/* Nom enrôleur */}
                                                <div>
                                                    <Label>Nom & Prénom de l&apos;enrôleur</Label>
                                                    <Input value={initialValue?.agent_enroleur?.name ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" />
                                                </div>
                                            </div>

                                            {/* Bloc Infos Enrôlé */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Colonne gauche (1 à 13) */}
                                                <div className="space-y-4">
                                                    <div><Label>1. Nom</Label><Input value={initialValue?.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>2. Prénoms</Label><Input value={initialValue?.prenom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>3. Date de naissance</Label><Input  value={formatDate2(initialValue?.datedenaissance)} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>4. Lieu de naissance</Label><Input value={initialValue?.lieudenaissance ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>5. Sexe</Label><Input value={initialValue?.sexe ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>6. Nationalité</Label><Input value={initialValue?.nationalit ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>7. Situation matrimoniale</Label><Input value={initialValue?.situationmatrimoniale ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>8. Niveau l&apos;instruction</Label><Input value={initialValue?.niveaudinstruction ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>9. Numéro principal</Label><Input value={initialValue?.numroprincipal ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600 font-mono" /></div>
                                                    <div><Label>10. Langue locale parlée</Label><Input value={initialValue?.languelocaleparle ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    {initialValue?.autreslanguelocaleparle && (
                                                        <div>
                                                            <Label>11. Autres langues locales parlées</Label>
                                                            <Input value={initialValue?.autreslanguelocaleparle ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" />
                                                        </div>
                                                    )}
                                                    <div><Label>12. Campement / Quartier</Label><Input value={initialValue?.campementquartier ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>13. Coordonnées géographiques</Label><Input value={initialValue?.coordonneesgeo ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                </div>

                                                {/* Colonne droite (14 à 22) */}
                                                <div className="space-y-4">

                                                    <div><Label>14. Activité principale</Label><Input value={initialValue?.activitprincipale?.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>15. Spéculation principale</Label><Input value={initialValue?.spculationprincipale?.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>

                                                    <div>
                                                        <Label>15bis. Autres activités</Label>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {initialValue?.autresActivites && initialValue.autresActivites.length > 0 ? (
                                                                initialValue.autresActivites.map((a) => (
                                                                    <Badge key={a.id} variant="outline" className="text-sm">
                                                                        {a.activite.nom}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <p className="text-gray-400 text-sm italic">Aucune autre activité</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label>15ter. Autres spéculations</Label>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {initialValue?.autresSpeculations && initialValue.autresSpeculations.length > 0 ? (
                                                                initialValue.autresSpeculations.map((s) => (
                                                                    <Badge key={s.id} variant="outline" className="text-sm">
                                                                        {s.speculation.nom}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <p className="text-gray-400 text-sm italic">Aucune autre spéculation</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div><Label>16. Superficie de la parcelle cultivée</Label><Input value={`${initialValue?.superficiedevotreparcellecultu || ''} ha`} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>17. Superficie totale en ha</Label><Input value={`${initialValue?.indiquezlasuperficieenha ?? ''} ha`} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>18. Quantité de production</Label><Input value={`${initialValue?.quantitproduction ?? ''} kg`} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>19. Nombre de personnes</Label><Input value={`${initialValue?.prcisezlenombre ?? ''}`} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>20. Moyen de stockage</Label><Input value={initialValue?.moyendestockage ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div> <Label>21. District</Label> <Input value={initialValue?.decoupage.district.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div> <Label>22. Région</Label> <Input value={initialValue?.decoupage.region.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div> <Label>23. Département</Label> <Input value={initialValue?.decoupage.department.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /></div>
                                                    <div><Label>24. Sous-préfecture</Label><Input value={initialValue?.decoupage.sousPrefecture.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /> </div>
                                                    <div><Label>25. Localité</Label><Input value={initialValue?.decoupage.localite.nom ?? ''} disabled className="mt-1 bg-gray-100 text-gray-600" /> </div>
                                                </div>
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </div>
                </div>


                <Toaster />
            </div>
        </div>
    );
}
