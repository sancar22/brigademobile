export const notifshow = data => {
    return {
        type: "NOTIFICATION",
        payload: data
    };
};

export const fillPlace = info => {
    return {
        type: "FILL_PLACE",
        payload: info
    };
};

export const fillCode = info => {
    return {
        type: "FILL_CODE",
        payload: info
    };
};

export const fillCategory = info => {
    return {
        type: "FILL_CATEGORY",
        payload: info
    };
};

export const selectAllOnline = info => {
    return {
        type: "SELECT_ALL_ONLINE",
        payload: info
    };
};

export const fillDate = info => {
    return {
        type: "FILL_DATE",
        payload: info
    };
};

export const fillAll = info => {
    return {
        type: "FILL_ALL",
        payload: info
    };
};

export const fillDescription = info => {
    return {
        type: "FILL_DESCRIPTION",
        payload: info
    };
};

export const fillInfo = info => {
    return {
        type: "SELECT_ONLINE",
        payload: info
    };
};
