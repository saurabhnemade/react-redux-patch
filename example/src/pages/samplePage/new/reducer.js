const INITIAL_STATE = { name: 'new page state', anotherProp: "another prop", test: "test" };

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default Reducer;
