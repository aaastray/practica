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