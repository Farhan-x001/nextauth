import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  // Prepare the chart data
  const chartData = {
    labels: data.map(item => item.category), // X-axis labels (categories)
    datasets: [
      {
        label: 'Amount', // Label for the first dataset
        data: data.map(item => item.amount), // Data for the 'Amount' bars
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light green color for bars
        borderColor: 'rgba(75, 192, 192, 1)', // Dark green border color
        borderWidth: 1, // Border width for bars
        stack: 'stack1', // Stack the bars for comparison
      },
      {
        label: 'Fraud Cases', // Label for the second dataset
        data: data.map(item => item.count), // Data for the 'Fraud Cases' bars
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Light red color for bars
        borderColor: 'rgba(255, 99, 132, 1)', // Dark red border color
        borderWidth: 1, // Border width for bars
        stack: 'stack2', // Stack the bars for comparison
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Comparison of Amount and Fraud Cases by Category', // Title of the chart
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Stack the bars on the x-axis
        title: {
          display: true,
          text: 'Categories', // Title for the x-axis
        },
      },
      y: {
        stacked: true, // Stack the bars on the y-axis
        beginAtZero: true, // Ensure Y-axis starts at zero
        title: {
          display: true,
          text: 'Value', // Title for the y-axis
        },
      },
    },
  };

  // Render the bar chart with the prepared data and options
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
/// update the 
//http://localhost:3001/api/categoryCounts?limit=100000

