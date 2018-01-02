let actions = new Map();

const addAction = (id, action) => {
    actions.set(id, action);
};

const removeAction = id => {
    actions.delete(id);
};

const clearActions = () => {
    actions.clear();
};

const getAction = id => {
    return actions.get(id);
};

const getActions = () => {
    return new Map(actions);
};

export {
    addAction,
    removeAction,
    clearActions,
    getAction,
    getActions
}