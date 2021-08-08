import { GridsterItem } from "angular-gridster2";
import { Todo } from "./todo";

export class Note {
    id!: number;
    userId!: string;
    title!: string;
    description!: string;
    image!: string;
    links!: string[];
    list!: Todo[];
}