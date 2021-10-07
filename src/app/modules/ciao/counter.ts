// This key is used to save the data for the hello counter in the database
export const CHAIN_STATE_HELLO_COUNTER = "ciao:numeroSaluti";

// This schema is used to decode/encode the data of the hello counter from/for the database
export const counterSchema = {
    $id: "lisk/ciao/counter",
    type: "object",
    required: ["numeroDiSaluti"],
    properties: {
        numeroDiSaluti: {
            dataType: "uint32",
            fieldNumber: 1,
        },
    },
};

export type counter = {
    numeroDiSaluti : number
}