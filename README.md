Для разработки одностраничного веб-приложения с тремя блоками (кнопки, график и таблица) я буду использовать компонентный подход, state-менеджер (redux), асинхронные операции для работы с API, а также добавлю тесты.

Структура проекта будет выглядеть следующим образом:
```
src/
├── index.html
├── index.js
├── App.jsx
├── package.json
│
├── components/
│   ├── ButtonPanel.jsx
│   ├── Chart.jsx
│   └── Table.jsx
│
├── redux/
│   ├── store.js
│   ├── types.js
│   ├── actions/
│   │   └── dataActions.js
│   └── reducers/
│       └── dataReducer.js
│
├── services/
│   ├── api.js
│   └── csvExport.js
│
└── tests/
    ├── unit/
    │   ├── csvExport.test.js
    │   └── dataReducer.test.js
    ├── integration/
    │   └── ButtonPanel.test.js
    └── e2e/
        └── app.test.js
```
##### Основные файлы приложения
###### Файлы из папки redux

Для начала я обозначу константы для различных типов действий Redux:
```js
// src/redux/types.js
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const CLEAR_DATA = 'CLEAR_DATA';
export const SELECT_ROW = 'SELECT_ROW';
```

Reducer — чистая функция которая будет отвечать за обновление состояния. FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE и т.д. это константы событий.
```js
// src/redux/reducers/dataReducer.js
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
```

Действия (actions) находятся в следующем файле:
```js
// src/redux/actions/dataActions.js
import {  
    FETCH_DATA_REQUEST,  
    FETCH_DATA_SUCCESS,  
    FETCH_DATA_FAILURE,  
    CLEAR_DATA,  
    SELECT_ROW  
} from '../types';  
import apiService from "../../services/api";

// Функция для получения данных
export function fetchData() {
  return async (dispatch) => {
    // Сообщаем о начале загрузки
    dispatch({ type: FETCH_DATA_REQUEST });
    
    // Пробуем получить данные
    try {
      const response = await apiService.getData();
      const maxRow = findRowWithMaxValue(response.data);
      
      dispatch({ 
        type: FETCH_DATA_SUCCESS, 
        payload: response.data,
        selectedRow: maxRow.id
      });
    } catch (error) {
      // сообщаем об ошибке
      dispatch({ 
        type: FETCH_DATA_FAILURE, 
        payload: error.message 
      });
    }
  };
}

// Функция для очистки данных
export function clearData() {
  return {
    type: CLEAR_DATA
  };
}

// Функция для выбора строки
export function selectRow(rowId) {
  return {
    type: SELECT_ROW,
    payload: rowId
  };
}

// Вспомогательная функция для поиска строки с максимальным значением
function findRowWithMaxValue(data) {
  // Логика поиска строки с максимальным числовым значением
  // ...
  return maxRow;
}
```

Создаем глобальное хранилище приложения:
```js
// src/redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import dataReducer from './reducers/dataReducer';

const rootReducer = combineReducers({
  data: dataReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
```
###### Файлы сервисов

Сервис для работы с API будет выглядеть следующим образом:
```js
// src/services/api.js
const apiService = {
  async getData() {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;
```

Сервис для экспорта в CSV также будет находиться в отдельном файле:
```js
// src/services/csvExport.js
const csvExportService = {
  exportToCSV(data, filename = 'export.csv') {
    const csvContent = this.convertToCSV(data);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    const rows = data.map(row => {
      return headers.map(header => {
        const value = row[header].toString();
        return `"${value.replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    return [headerRow, ...rows].join('\n');
  }
};

export default csvExportService;
```
###### Файлы компонентов

Компонент отображающий панель из трех кнопок "Получить данные", "Очистить данные", "Сохранить в CSV":
```js
// src/components/ButtonPanel.jsx
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
```

Компонент графика:
```js
// src/components/Chart.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';

function Chart() {
  const chartRef = useRef(null);
  const { data, selectedRowId } = useSelector(state => state.data);
  
  if (data.length === 0) {
    return <div className="chart-container">Нет данных для отображения</div>;
  }
  
  if (!selectedRowId) {
    return <div className="chart-container">Выберите строку в таблице</div>;
  }
  
  const selectedRow = data.find(row => row.id === selectedRowId);
  
  if (!selectedRow) {
    return <div className="chart-container">Выбранная строка не найдена</div>;
  }
  
  const chartData = Object.entries(selectedRow)
    .filter(([key, value]) => 
      key !== 'id' && 
      typeof value === 'number'
    )
    .map(([key, value]) => ({ key, value }));
  
  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      drawChart();
    }
  }, [selectedRowId, data]);
  
  // Функция для отрисовки графика с помощью D3.js
  const drawChart = () => {
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Код для создания столбчатой диаграммы с D3.js
    // Примерный псевдокод:
    /*
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
      
    svg.selectAll('rect')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (barWidth + barPadding))
      .attr('y', d => height - d.value * scale)
      .attr('width', barWidth)
      .attr('height', d => d.value * scale)
      .attr('fill', 'steelblue');
    */
  };
  
  return (
    <div className="chart-container">
      <div ref={chartRef} className="chart"></div>
    </div>
  );
}

export default Chart;
```

Компонент таблицы:
```js
// src/components/Table.jsx
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
```
###### Корневой файл
```js
// src/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import ButtonPanel from './components/ButtonPanel';
import Chart from './components/Chart';
import Table from './components/Table';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <h1>Приложение с данными</h1>
        
        <section className="button-section">
          <ButtonPanel />
        </section>
        
        <section className="chart-section">
          <Chart />
        </section>
        
        <section className="table-section">
          <Table />
        </section>
      </div>
    </Provider>
  );
}

export default App;
```
##### Стратегия тестирования приложения
###### Юнит-тесты
- проверяют отдельные компоненты и функции в изоляции.
Пример теста для редьюсера:
```js
// src/tests/unit/dataReducer.test.js
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
```

Тест для сервиса экспорта CSV:
```js
// src/tests/unit/csvExport.test.js
import csvExportService from '/services/csvExport';

describe('CSV Export Service', () => {
  test('должен корректно преобразовывать данные в CSV', () => {
    const testData = [
      { id: 1, name: 'Test 1', value: 100 },
      { id: 2, name: 'Test, with comma', value: 200 }
    ];
    
    const expected = 'id,name,value\n"1","Test 1","100"\n"2","Test, with comma","200"';
    
    expect(csvExportService.convertToCSV(testData)).toBe(expected);
  });
  
  // Тест с моками DOM API
  test('должен вызывать правильные DOM API при экспорте', () => {
    global.URL.createObjectURL = jest.fn(() => 'blob:url');
    const mockLink = {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {}
    };
    document.createElement = jest.fn(() => mockLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    const testData = [{ id: 1, name: 'Test', value: 100 }];
    
    csvExportService.exportToCSV(testData, 'test.csv');
    
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:url');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });
});
```
###### Интеграционные тесты
- проверяют взаимодействие между компонентами.
Тест для проверки панели кнопок:
```js
// src/tests/integration/ButtonPanel.test.js
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
```
###### E2E тесты
- проверяют работу всего приложения в целом
```js
// src/tests/e2e/app.test/js

// Тестирование e2e можно производить с помощью различных фреймворков, но очень много пишут про Cypress.

describe('Приложение', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.example.com/data', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Row 1', x1: 10, x2: 20, x3: 30, x4: 40, x5: 50 },
        { id: 2, title: 'Row 2', x1: 15, x2: 25, x3: 35, x4: 45, x5: 55 },
        { id: 3, title: 'Row 3', x1: 5, x2: 15, x3: 25, x4: 35, x5: 45 }
      ]
    }).as('getData');
    
    cy.visit('/');
  });

  // Проверка кнопок
  it('должно загружать и отображать данные при клике на кнопку "Получить данные"', () => {
    cy.contains('Получить данные').click();
    cy.wait('@getData');
    
    cy.get('table').should('exist');
    cy.contains('Row 1').should('exist');
    cy.contains('Row 2').should('exist');
    cy.contains('Row 3').should('exist');
    
    cy.contains('Row 2').parent('tr').should('have.class', 'selected');
    cy.get('.chart').should('exist');
  });
  
  it('должно очищать данные при клике на кнопку "Очистить данные"', () => {
    cy.contains('Получить данные').click();
    cy.wait('@getData');
    cy.contains('Очистить данные').click();
    cy.contains('Нет данных для отображения').should('exist');
    cy.get('.chart').contains('Нет данных для отображения').should('exist');
  });
  
  it('должно менять выбранную строку и обновлять график при клике на строку таблицы', () => {
    cy.contains('Получить данные').click();
    cy.wait('@getData');
    
    cy.contains('Row 1').click();
    cy.contains('Row 1').parent('tr').should('have.class', 'selected');
    cy.get('.chart').should('exist');
  });
  
  it('должно экспортировать данные в CSV при клике на кнопку "Сохранить в CSV"', () => {
    cy.window().then(win => {
      cy.stub(win.document, 'createElement').returns({
        setAttribute: cy.stub(),
        style: {},
        click: cy.stub(),
      });
      cy.stub(win.document.body, 'appendChild').as('appendChildStub');
      cy.stub(win.document.body, 'removeChild').as('removeChildStub');
    });
    
    cy.contains('Получить данные').click();
    cy.wait('@getData');
    
    cy.contains('Сохранить в CSV').click();
    cy.get('@appendChildStub').should('have.been.called');
    cy.get('@removeChildStub').should('have.been.called');
  });
});

```
