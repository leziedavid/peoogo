"use client";

import React from "react";
import { Tableau } from "@/components/dash/tableau";
import { useOrderSocket } from '@/lib/socket/useOrderSocket';

export default function DashboardPage() {
  // useOrderSocket()
  
  return (

    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
            <Tableau/>
    </div>

    );
}


