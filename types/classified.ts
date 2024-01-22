import { IClassifiedOption } from "~/types/classifiedOption";

export interface IClassified {
    id: string,
    name: string,
    description: string,
    price: string,
    offerNumber: string,
    options: IClassifiedOption[],
}