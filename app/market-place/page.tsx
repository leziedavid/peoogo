
import { Footer } from "@/components/home/Footer";
// import HeaderMarket from "@/components/market/HeaderMarket";
import MyMarket from "@/components/market/Market";
import EAgriMenu from "@/components/market/EAgriMenu";

export default async function Home() {

    return (
        <>
            <div className="mb-8">
                <EAgriMenu />
                <div className={`min-h-[calc(100vh_-_56px)] mt-1`}>
                    <MyMarket />
                </div>
            </div>
            <Footer />

        </>


    );
}
