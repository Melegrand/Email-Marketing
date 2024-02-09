import dateFormat from "dateformat";
import compareDate from "./compareDate";

class Campaign {
    #id;
    #name;
    #start;
    #end;

    constructor(id, name, start, end) {
        this.id = id;
        this.name = name;
        this.start = start;
        this.end = end;
    }


    get id() {
        return this.#id
    }

    get status() {
      // Je définit le satut grâce à ma fonction compareDate
        const actualStatus = compareDate(this.start, this.end)
        let status;         
        // Je change le nom du statut pour le mettre en français
        switch (actualStatus) {
            case 'programmed':
                status = 'Programmée';
              break;
            case 'current':
                status = 'En cours';
              break;
            case 'past':
                status = 'Terminée';
              break;
          }
        return status;
    }

    get name() {
        return this.#name
    }

    get title() {
        // Je formate les dates en dd/mm/yyyy pour l'affichage
        const dateStart = dateFormat(this.start, "dd/mm/yyyy")
        const dateEnd = dateFormat(this.end, "dd/mm/yyyy") 
        // Je définit le contenu du titre avec le statut, les dates et le nom de la campagne
        return `${this.status}, ${dateStart} au ${dateEnd}, ${this.name}`
    }

    get start() {
        return this.#start
    }

    get end() {
        return this.#end
    }

    get calendarId() {
        return 'cal1';
    }

    get category() {
        return 'allday';
    }

    // J'utilise la fonction getBackgroundColor pour définir la couleur de fond de l'event
    get className() {    
        return compareDate(this.#start, this.end);
    }

    set id(id) {
        this.#id = id;
    }

    set start(start) {
        this.#start = start;
    }

    set end(end) {
        this.#end = end;
    }

    set name(name) {
        this.#name = name;
    }
}

export default Campaign;