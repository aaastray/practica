import {
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_FAILURE,
    CLEAR_DATA,
    SELECT_ROW
} from '../types';

const initialState = {
    data: [],
    loading: false,
    error: null,
    selectedRowId: null
};

function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                selectedRowId: action.selectedRow
            };

        case FETCH_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_DATA:
            return {
                ...state,
                data: [],
                selectedRowId: null
            };

        case SELECT_ROW:
            return {
                ...state,
                selectedRowId: action.payload
            };

        default:
            return state;
    }
}

export default dataReducer;