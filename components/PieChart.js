import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Fraudulent', 'Non-Fraudulent'], // Categories for pie chart
    datasets: [
      {
        data: [
          data.filter(item => item.fraud === 1).length, // Fraudulent count
          data.filter(item => item.fraud === 0).length, // Non-fraudulent count
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
