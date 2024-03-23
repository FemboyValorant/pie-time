// Get user inputs and create pie chart
function createPieChart() {
    var tasksInput = prompt("Enter tasks separated by comma:");
    var tasks = tasksInput.split(',').map(function(task) {
        return task.trim().toLowerCase();
    });

    var taskCounts = {};
    tasks.forEach(function(task) {
        taskCounts[task] = (taskCounts[task] || 0) + 1;
    });

    var labels = Object.keys(taskCounts);
    var data = Object.values(taskCounts);

    var ctx = document.getElementById('myPieChart').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Tasks Distribution'
            }
        }
    });
}

createPieChart();

