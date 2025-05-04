import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ButtonPanel from '/components/ButtonPanel';
import * as actions from '/redux/actions/dataActions';

jest.mock('/redux/actions/dataActions', () => ({
    fetchData: jest.fn(() => ({ type: 'MOCKED_FETCH_DATA' })),
    clearData: jest.fn(() => ({ type: 'MOCKED_CLEAR_DATA' }))
}));

jest.mock('/services/csvExport', () => ({
    exportToCSV: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe('ButtonPanel Integration', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            data: {
                data: [{ id: 1, name: 'Test', value: 100 }],
                loading: false
            }
        });

        store.dispatch = jest.fn();
    });

    test('должен вызывать fetchData при клике на кнопку "Получить данные"', () => {
        render(
            <Provider store={store}>
                <ButtonPanel />
            </Provider>
        );

        fireEvent.click(screen.getByText('Получить данные'));

        expect(actions.fetchData).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'MOCKED_FETCH_DATA' });
    });

    // Аналогичные тесты для других кнопок
    // ...
});