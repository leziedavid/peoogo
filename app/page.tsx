"use client";

import React from "react";

import HeaderMarket from "@/components/market/HeaderMarket";
import HomeMarket from "@/components/market/HomeMarket";
import NosPartenaires from "@/components/market/NosPartenaires";
import { Footer } from "@/components/home/Footer";
import AgricultureBanner from "@/components/market/AgricultureBanner";
import Forms from "@/components/market/Forms";
import EAgriMenu from "@/components/market/EAgriMenu";
import EAgriSlider from "@/components/market/EAgriSlider";

export default function Page() {

  return (
    <>




      {/* <HeaderMarket /> */}
        <EAgriMenu />
      <EAgriSlider />

      <div className={`min-h-[calc(100vh_-_56px)] px-3 lg:px-6`}>

        {/* <Slider /> */}
        <HomeMarket />
        <AgricultureBanner />
        <Forms />
        <NosPartenaires />

      </div>
      <Footer />
    </>
  );
}
