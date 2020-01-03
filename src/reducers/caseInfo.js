const initState = {
    lugarEmergencia: null,
    codigo: null,
    categoria: null,
    descAdicional: "",
    date: null
};

const fillCaseInfoReducer = (state = [], action) => {
    switch (action.type) {
        case "FILL_ALL": // Brigadistas online
            return (state = action.payload);
        default:
            return state;
    }
};

export default fillCaseInfoReducer;
