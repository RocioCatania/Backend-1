

class Conatdor {
    constructor(nombre){
        this.responsable=nombre;
        this.contador=0;
    }
    static contadorGlobal= 0;

    getResponsable(){
        return this.responsable;
    }

    contador(){
        this.contador ++;
        this.contador.contadorGlobal ++;
    }

    getCuentaIndividual(){
        return this.contador;
    }

    getCuentaGlobal(){
        return this.contador.contadorGlobal;
    }
}