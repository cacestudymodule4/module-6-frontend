import React, {useEffect, useRef} from "react";
import ApexCharts from "apexcharts";

const ChartComponent = ({data}) => {
    const chartRef = useRef(null);
    useEffect(() => {
        if (data && chartRef.current) {
            const chartOptions = {
                series: [{
                    name: 'revenue',
                    data: Object.values(data),
                }],
                chart: {
                    type: 'bar',
                    height: 41.9 * Object.keys(data).length,
                    toolbar: {
                        show: true
                    }
                },
                xaxis: {
                    categories: Object.keys(data),
                },
                colors: ['#28a745'],
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: false
                    }
                }
            }
            const newChart = new ApexCharts(chartRef.current, chartOptions);
            newChart.render();
            return () => {
                newChart.destroy();
            }
        }
    }, [data]);
    if (!data) return null;
    return <div className="col-12 col-lg-9" id="diagram">
        <div className="card widget-card border-light shadow-sm">
            <div className="card-body p-4">
                <h5 className="card-title widget-card-title mb-2">Doanh Thu</h5>
                <div id="bsb-chart-8" ref={chartRef} className="mt-2"></div>
            </div>
        </div>
    </div>
}
export default ChartComponent;
