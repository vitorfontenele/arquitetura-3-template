import { BadRequestError } from "../errors/BadRequestError"
import { Product } from "../models/Product"

export interface ProductDTOInput {
    id : string,
    name : string,
    price : number
}

export interface ProductDTOOutput {
    message : string,
    product : {
        id : string,
        name : string,
        price : number,
        createdAt : string
    }
}

export class ProductDTO { 
    public createProductInput(
        id : unknown,
        name : unknown,
        price : unknown
    ) : ProductDTOInput {
        if (id === undefined) throw new BadRequestError("'id' deve ser informado");
        if (typeof id !== "string") throw new BadRequestError("'id' deve ser string")

        if (name === undefined) throw new BadRequestError("'name' deve ser informado");
        if (typeof name !== "string") throw new BadRequestError("'name' deve ser string")

        if (price === undefined) throw new BadRequestError("'price' deve ser informado");
        if (typeof price !== "number") throw new BadRequestError("'price' deve ser number")
        
        const dto : ProductDTOInput = {
            id,
            name,
            price
        }

        return dto;
    } 

    public createProductOutput(product : Product) : ProductDTOOutput {
        const dto : ProductDTOOutput = {
            message: "Produto criado com sucesso",
            product: {
                id : product.getId(),
                name : product.getName(),
                price: product.getPrice(),
                createdAt: product.getCreatedAt()
            }
        }

        return dto;
    }
}