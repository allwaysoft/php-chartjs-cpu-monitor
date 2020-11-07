const requestsStats = document.querySelector('.requestsStats');
const errorsPercent = document.querySelector('.errorsPercent');
let requestsCounter = 1;
let errorsCounter = 0;

// get CPU data from JSON 
function getCpuData () {
    fetch('poll_cpu_usage.php')
    .then(response => {
        let data = response.json();
        return data;
    })
    .then(data => {
        if (data === 0) { errorsCounter++; }
        addData(data);
    })
    .catch(error =>  console.error(error));

    // stats
    let percent = Math.floor(100 * errorsCounter / requestsCounter);
    requestsStats.innerHTML = requestsCounter++;
    errorsPercent.innerHTML = `${percent}%`;
};

// work with chart.js library
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'CPU usage %',
            backgroundColor: ['rgba(76, 209, 55, 0.2)'],
            borderColor: 'lightgreen',
            borderWidth: 1
        }],
    }, options: {
        title: {
            display: true,
            text: 'CPU Monitor'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                }
            }],
            xAxes: [{
                display: true
            }],
        },
    },
});

function formatDate(time){
	var date = new Date(time);

	var year = date.getFullYear(),
		month = date.getMonth() + 1,//月份是从0开始的
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds();
	var newTime = year + '-' +
				month + '-' +
				day + ' ' +
				hour + ':' +
				min + ':' +
				sec;
	return newTime;			
}

// update myChart
function addData(data) {
    if (myChart.data.labels.length>10){
    	myChart.data.labels.shift();		
    }
    myChart.data.labels.push(formatDate(new Date().getTime()));
    myChart.data.datasets.forEach((dataset) => {
        if(data === 0) {
            dataset.data.push(dataset.data[dataset.data.length - 1]);
        } else {
        		if (dataset.data.length>10){
        			dataset.data.shift();         	
            }
            dataset.data.push(data);
        };
    });
    myChart.update();
};

setInterval(getCpuData, 5000);