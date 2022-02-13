

// Function to get OUT data for Bar plot
function getBarData(otuId) {
    //filter the data for the plot, labels and hovertext
    let sample_subset = samples.filter(sample => sample.id === otuId);
    let sample_values = sample_subset[0].sample_values.slice(0,10);
    let otu_ids = sample_subset[0].otu_ids.slice(0,10);
    let otu_hovertext = sample_subset[0].otu_labels.slice(0,10);
    otu_ids = otu_ids.map(lbl => "OTU" + lbl);


    // bar chart
    let BarChart = 
        [{
            x: sample_values,
            y: otu_ids,
            text: otu_hovertext,
            type: 'bar',
            orientation: 'h'
        }];
    // Set up layout
    let layout = {
        title: `Top 10 OTUs found in Test Subject ID: ${sample_subset[0].id}`,
        showlegend: false
    };
    // create data call
    let BarData = {
        trace: BarChart,
        layout: layout
    };

    return BarData;
}



// Load the data
d3.json("data/samples.json")
.then(function(data){

    // Parse out the samples section for use
    samples = data.samples;
    metaData = data.metadata;
    console.log(metaData);

    // Load the select dropdownlist with the ID's to filter on
    d3.select('#selDataset')
    .selectAll('option')
    .data(data.names)
    .enter()
    .append('option')
    .text(function (droplistdata) { return droplistdata; })
    .attr('value', function (droplistdata) { return droplistdata; });    


    // Set starting values when page loads for first time

    // Call my function to filter the data for chart
    let data_bar = getBarData(data.names[0]);
    // Initialize chart
    Plotly.newPlot('bar', data_bar.trace, data_bar.layout);
    
    let data_gauge = getGaugeData(data.names[0]);
    Plotly.newPlot('gauge', data_gauge.trace, data_guage.layout); 

    let data_bubble = getBubbleData(data.names[0]);
    Plotly.newPlot('bubble', data_bubble.trace, data_bubble.layout); 

    let data_meta = getMetaData(data.names[0]);
    updateDemographicData(data_meta);  
});