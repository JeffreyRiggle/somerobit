const fullAccess = '*';
let accessMap = new Map();
let defaultAccess = [];
let deniedMessage = 'You do not have the rights to perform this action';

const setDefaultAccess = (rights) => {
    defaultAccess = rights;
};

const grantAccess = (user, rights) => {
    let currentRights = accessMap.get(user);
    if (currentRights) {
        accessMap.set(user, currentRights.concat(rights));   
    } else {
        accessMap.set(user, rights);
    }
};

const revokeAccess = (user, rights) => {
    let currentRights = accessMap.get(user);
    if (!currentRights) {
        return;
    }

    let newRights = currentRights.filter(right => {
        return !rights.includes(right);
    });

    accessMap.set(user, newRights);
};

const hasAccess = (user, right) => {
    let userRights = accessMap.get(user);
    if (!userRights) {
        userRights = defaultAccess;
    }

    if (userRights.includes(fullAccess)) {
        return true;
    }

    let retVal = false;
    userRights.forEach((val, index, arr) => {
        if (retVal) {
            return;
        }

        if (val === right) {
            retVal = true;
        }
    });

    return retVal;
};

const setInvalidAccessMessage = (message) => {
    deniedMessage = message;
};

const invalidAccessMessage = () => {
    return deniedMessage;
};

export {
    setDefaultAccess,
    grantAccess,
    revokeAccess,
    hasAccess,
    setInvalidAccessMessage,
    invalidAccessMessage
}