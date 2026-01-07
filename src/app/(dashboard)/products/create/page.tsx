import ProductForm from "@/components/products/product-form"

export default function CreateProductPage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6">
                <ProductForm />
            </div>
        </div>
    )
}
