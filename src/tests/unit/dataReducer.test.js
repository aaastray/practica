import dataReducer from '/redux/reducers/dataReducer';
import * as types from '/redux/types';

describe('Data Reducer', () => {
    test('должен вернуть начальное состояние', () => {
        expect(dataReducer(undefined, {})).toEqual({
            data: [],
            loading: false,
            error: null,
            selectedRowId: null
        });
    });

    test('должен обработать FETCH_DATA_REQUEST', () => {
        const initialState = {
            data: [],
            loading: false,
            error: null,
            selectedRowId: null
        };

        const action = {
            type: types.FETCH_DATA_REQUEST
        };

        expect(dataReducer(initialState, action)).toEqual({
            data: [],
            loading: true,
            error: null,
            selectedRowId: null
        });
    });

    // Аналогичные тесты для других действий
    // ...
});