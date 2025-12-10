'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, Legend} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EnrollementStatByDate } from '@/types/ApiReponse/StatistiquesEnrollementResponse';

interface Props {
    data: EnrollementStatByDate[];
}

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export default function EnrollementGraph({ data }: Props) {
    const color = getRandomColor();

    return (
        <Card className="w-full p-4">
            <Tabs defaultValue="line">
                <TabsList className="mb-4">
                    <TabsTrigger value="line">Ligne</TabsTrigger>
                    <TabsTrigger value="bar">Barres</TabsTrigger>
                    <TabsTrigger value="area">Zone</TabsTrigger>
                </TabsList>

                <TabsContent value="line">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke={color} strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="bar">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill={color} />
                        </BarChart>
                    </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="area">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="total" stroke={color} fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </TabsContent>
            </Tabs>
        </Card>
    );
}
