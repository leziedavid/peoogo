"use client";

import { LucideShoppingCart, ShoppingCart } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/app/context/CartProvider";
import { Product } from "@/types/ApiReponse/ProduitsResponse";
import AlertCart from "./AlertCart";

interface Props {
  product: Product;
}

const BuyingOptions: FC<Props> = ({ product }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { updateCart } = useCart();

  const onAddToCartClick = () => {

    updateCart(product, 1);
    setIsAlertOpen(true);

  };

  return (

    <>
      <Button onClick={onAddToCartClick} className="w-fit flex items-center gap-2 bg-[#B07B5E] text-white hover:bg-[#022d13] hover:text-white">
        <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter au panier
      </Button>

      <AlertCart
        product={product}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default BuyingOptions;
