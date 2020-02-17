const allBrigaders = (state = [], action) => {
    switch (action.type) {
        case "SELECT_ALL_ONLINE":
            return (state = action.payload);
        default:
            return state;
    }
};

export default allBrigaders;
