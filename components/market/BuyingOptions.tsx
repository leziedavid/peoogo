"use client";

import { LucideShoppingCart } from "lucide-react";
import { FC } from "react";
import { useCart } from "@/app/context/CartProvider";
import { Button } from "../ui/button";
import { Product } from "@/types/ApiReponse/ProduitsResponse";

interface Props {
  product: Product;
}

const BuyingOptions: FC<Props> = ({ product }) => {

  const { updateCart } = useCart();
  const onAddToCartClick = () => {
    
    updateCart(product, 1);
  };

  return (

    <Button onClick={onAddToCartClick} className="w-full py-2 text-white rounded-lg bg-[#014c20] hover:bg-[#014c20] transition duration-300">
    <LucideShoppingCart className="w-5 h-5 text-white " /> 
    <span className="hidden sm:inline ml-2">Ajouter au panier</span>
  </Button>

  );
};

export default BuyingOptions;
