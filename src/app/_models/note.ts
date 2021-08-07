import { GridsterItem } from "angular-gridster2";

export class Note {
    id!: number;
    userId!: string;
    title!: string;
    description!: string;
    image!: string;
    links!: string[];
    lists!: string[];
}