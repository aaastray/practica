import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectRow } from '../redux/actions/dataActions';

function Table() {
    const dispatch = useDispatch();
    const { data, selectedRowId, loading } = useSelector(state => state.data);

    if (loading) {
        return <div className="table-container">Загрузка данных...</div>;
    }

    if (data.length === 0) {
        return <div className="table-container">Нет данных для отображения</div>;
    }

    const handleRowClick = (rowId) => {
        dispatch(selectRow(rowId));
    };

    const headers = Object.keys(data[0]);

    return (
        <div className="table-container">
            <table>
                <thead>
                <tr>
                    {headers.map(header => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map(row => (
                    <tr
                        key={row.id}
                        onClick={() => handleRowClick(row.id)}
                        className={selectedRowId === row.id ? 'selected' : ''}
                    >
                        {headers.map(header => (
                            <td key={`${row.id}-${header}`}>{row[header]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;