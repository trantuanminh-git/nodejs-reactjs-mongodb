import { createContext, useReducer } from "react";

const INITIAL_STATE = {
    city: undefined,
    dates: [],
    options: {
        adult: undefined,
        children: undefined,
        room: undefined,
    },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
    switch (action.type) {  // action chính là cái object mình tuyền vào hàm dispatch ở chỗ mình dùng nó (chỗ mình consume nó)
        case "NEW_SEARCH":
            return action.payload;
        case "RESET_SEARCH":
            return INITIAL_STATE;
        default:
            return state;
    }
};

export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);
    // when dispatch is called, SearchReducer function will automatically be called
    return (
        <SearchContext.Provider
            value={{
                city: state.city,
                dates: state.dates,
                options: state.options,
                dispatch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
