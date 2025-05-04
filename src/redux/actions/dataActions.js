import {
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_FAILURE,
    CLEAR_DATA,
    SELECT_ROW
} from '../types';
import apiService from "../../services/api";

export function fetchData() {
    return async (dispatch) => {
        dispatch({ type: FETCH_DATA_REQUEST });

        try {
            const response = await apiService.getData();
            const maxRow = findRowWithMaxValue(response.data);

            dispatch({
                type: FETCH_DATA_SUCCESS,
                payload: response.data,
                selectedRow: maxRow.id
            });
        } catch (error) {
            dispatch({
                type: FETCH_DATA_FAILURE,
                payload: error.message
            });
        }
    };
}

export function clearData() {
    return {
        type: CLEAR_DATA
    };
}

export function selectRow(rowId) {
    return {
        type: SELECT_ROW,
        payload: rowId
    };
}

function findRowWithMaxValue(data) {
    // Логика поиска строки с максимальным числовым значением
    // ...
    return maxRow;
}