import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UtilsService {

    constructor() {}

    setTitle(title: string) {
        document.title = this.toTitleCase(title);
    }

    resetTitle() {
        document.title = 'Echotaxis';
    }

    toTitleCase(string: string) {
        const array = string.split(' ');
        const titleCaseArray = [];

        for (let s of array) {
            titleCaseArray.push(s[0].toUpperCase() + s.slice(1));
        }

        return titleCaseArray.join(' ');
    }

    getRandomSelector() {
        const number = Math.random() * 100;
        return 's' + number.toString().split('.')[1];
    }

}