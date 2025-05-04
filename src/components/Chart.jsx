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