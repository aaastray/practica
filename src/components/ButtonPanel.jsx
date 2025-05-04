import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, clearData } from '../redux/actions/dataActions';
import csvExportService from '../services/csvExport';

function ButtonPanel() {
    const dispatch = useDispatch();
    const { data, loading } = useSelector(state => state.data);

    const handleFetchData = () => {
        dispatch(fetchData());
    };

    const handleClearData = () => {
        dispatch(clearData());
    };

    const handleSaveToCSV = () => {
        if (data.length > 0) {
            csvExportService.exportToCSV(data, 'table-data.csv');
        }
    };

    return (
        <div className="button-panel">
            <button
                onClick={handleFetchData}
                disabled={loading}
            >
                {loading ? 'Загрузка...' : 'Получить данные'}
            </button>

            <button
                onClick={handleClearData}
                disabled={loading || data.length === 0}
            >
                Очистить данные
            </button>

            <button
                onClick={handleSaveToCSV}
                disabled={loading || data.length === 0}
            >
                Сохранить в CSV
            </button>
        </div>
    );
}

export default ButtonPanel;