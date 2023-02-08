import { ProductDatabase } from "../database/ProductDatabase"
import { ProductDTO, ProductDTOInput } from "../dtos/ProductDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Product } from "../models/Product"
import { ProductDB } from "../types"

export class ProductBusiness {
    constructor(
        private productDTO: ProductDTO,
        private productDatabase: ProductDatabase
    ){}

    public getProducts = async (input: any) => {
        const { q } = input

        // const productDatabase = new ProductDatabase()
        const productsDB = await this.productDatabase.findProducts(q)

        const products: Product[] = productsDB.map((productDB) => new Product(
            productDB.id,
            productDB.name,
            productDB.price,
            productDB.created_at
        ))

        return products
    }

    public createProduct = async (input : ProductDTOInput) => {
        const { id, name, price } = input;

        if (name.length < 2) {
            throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
        }

        if (price <= 0) {
            throw new BadRequestError("'price' não pode ser zero ou negativo")
        }

        // const productDatabase = new ProductDatabase()
        const productDBExists = await this.productDatabase.findProductById(id)

        if (productDBExists) {
            throw new BadRequestError("'id' já existe")
        }

        const newProduct = new Product(
            id,
            name,
            price,
            new Date().toISOString()
        )

        const newProductDB: ProductDB = {
            id: newProduct.getId(),
            name: newProduct.getName(),
            price: newProduct.getPrice(),
            created_at: newProduct.getCreatedAt()
        }

        await this.productDatabase.insertProduct(newProductDB)

        // const productDTO = new ProductDTO();
        const output = this.productDTO.createProductOutput(newProduct);
 
        return output;
    }

    public editProduct = async (input: any) => {
        const {
            idToEdit,
            newId,
            newName,
            newPrice,
            newCreatedAt
        } = input

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                throw new BadRequestError("'id' deve ser string")
            }
        }
        
        if (newName !== undefined) {
            if (typeof newName !== "string") {
                throw new BadRequestError("'name' deve ser string")
            }

            if (newName.length < 2) {
                throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres")
            }
        }
        
        if (newPrice !== undefined) {
            if (typeof newPrice !== "number") {
                throw new BadRequestError("'price' deve ser number")
            }
    
            if (newPrice <= 0) {
                throw new BadRequestError("'price' não pode ser zero ou negativo")
            }
        }

        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== "string") {
                throw new BadRequestError("'createdAt' deve ser string")
            }

            // outras validações de data
        }

        // const productDatabase = new ProductDatabase()
        const productToEditDB = await this.productDatabase.findProductById(idToEdit)

        if (!productToEditDB) {
            throw new NotFoundError("'id' para editar não existe")
        }

        const product = new Product(
            productToEditDB.id,
            productToEditDB.name,
            productToEditDB.price,
            productToEditDB.created_at
        )

        newId && product.setId(newId)
        newName && product.setName(newName)
        newPrice && product.setPrice(newPrice)
        newCreatedAt && product.setCreatedAt(newCreatedAt)

        const updatedProductDB: ProductDB = {
            id: product.getId(),
            name: product.getName(),
            price: product.getPrice(),
            created_at: product.getCreatedAt()
        }

        await this.productDatabase.updateProduct(updatedProductDB)

        const output = {
            message: "Produto editado com sucesso",
            product: product
        }

        return output
    }

    public deleteProduct = async (input: any) => {
        const { idToDelete } = input

        const productDatabase = new ProductDatabase()
        const productToDeleteDB = await productDatabase.findProductById(idToDelete)

        if (!productToDeleteDB) {
            throw new NotFoundError("'id' para deletar não existe")
        }

        await productDatabase.deleteProductById(productToDeleteDB.id)

        const output = {
            message: "Produto deletado com sucesso"
        }

        return output
    }
}