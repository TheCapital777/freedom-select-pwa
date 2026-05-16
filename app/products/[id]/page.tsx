import { PRODUCTS } from "@/lib/mockData";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
