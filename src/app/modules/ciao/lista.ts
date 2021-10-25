export const CHAIN_STATE_HELLOS = "ciao:listaSaluti";


export const listaSchema = {
    $id: "lisk/ciao/lista",
    type: "object",
    required: ["saluti"],
    properties: {
        saluti: {
            type: "array",
            fieldNumber: 1,
            items : {
                type: "object",
                required: ["messaggio", "sender"],
                properties : {
                    messaggio: {
                        dataType: "string",
                        fieldNumber: 1,
                    },
                    sender: {
                        dataType: "string",
                        fieldNumber: 2,
                    },
                }
            }
        },
    },
};

export type singolo_saluto = {
    messaggio : string,
    sender: string
}

export type lista_saluti = {
    saluti: singolo_saluto[]
}

