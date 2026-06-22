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

    base64ToBlob(base64: string, mime: string) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        return new Blob([byteArray], { type: mime });
    }

    fileDataToFile(fileData: { data64: string, name: string, type: string }) {
        const blob = this.base64ToBlob(fileData.data64, fileData.type);
        return new File([blob], fileData.name, { type: fileData.type });
    }

}