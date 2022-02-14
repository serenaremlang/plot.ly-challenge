// Function to get OUT data for Bar plot
function getBarData(otuId) {
    //filter the data for the plot, labels and hovertext
    let sample_subset = samples.filter(sample => sample.id === otuId).reverse();
    let sample_values = sample_subset[0].sample_values.slice(0,10).reverse();
    let otu_ids = sample_subset[0].otu_ids.slice(0,10).reverse();
    let otu_hovertext = sample_subset[0].otu_labels.slice(0,10).reverse();
    otu_ids = otu_ids.map(lbl => "OTU " + lbl);


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
        // title: `Top 10 OTUs found in Test Subject ID: ${sample_subset[0].id}`,
        showlegend: false
    };
    // create data call
    let BarData = {
        trace: BarChart,
        layout: layout
    };

    return BarData;
}

// Function to get data for Bubble plot
function getBubbleData(otuId) {
    //filter the data for the plot, labels and hovertext
    let sample_subset = samples.filter(sample => sample.id === otuId);
    let sample_values = sample_subset[0].sample_values;
    let otu_ids = sample_subset[0].otu_ids;
    let otu_hovertext = sample_subset[0].otu_labels;

    // bubble chart
    let BubbleChart = 
        [{
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                colorscale: "Earth",
                size: sample_values,
                color: otu_ids
            },
            text: otu_hovertext
        }];

    // Set up layout
    let layout = {
        // title: `Bubble Chart for Test Subject ID:${sample_subset[0].id}`,
        xaxis: {
            title: 'OTU ID'
        },
        showlegend: false
    };
    // create data call
    let BubbleData = {
        trace: BubbleChart,
        layout: layout
    };

    return BubbleData;
}
// Function to get data for demographic box
function getMetaData(otuId) {
    //filter the data for the plot, labels and hovertext
    let DemographicData = metaData.filter(demographicData => demographicData.id == otuId);

    return DemographicData[0];
}

// Function to update the demographic info panel
function DemographicInfoPanel(DemoData)
{
    divfordemo = d3.select('#sample-metadata');
    divfordemo.html("");
    for (const [key, value] of Object.entries(DemoData)) {
        var row = divfordemo.append("div")
        row.append("span")
            .style("font-size", "90%")
            .style("padding-right", "3px")
            .text(key + ": ");
        row.append('span')
            .style("font-size", "90%")
            .text(value);
    }
};

// OnChange function for select. Takes in the Test Subject ID to fitler on
function optionChanged(otuId) {  
    let barplotupdate = getBarData(otuId);
    Plotly.react('bar', barplotupdate.trace, barplotupdate.layout); 

    let bubbleplotupdate = getBubbleData(otuId);
    Plotly.react('bubble', bubbleplotupdate.trace, bubbleplotupdate.layout); 

    let metaInfo = getMetaData(otuId);
    DemographicInfoPanel(metaInfo); 
};

// Load the data
d3.json("data/samples.json")
.then(function(data){

    // Parse out the samples section for use
    samples = data.samples;
    metaData = data.metadata;
    // console.log(metaData);

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

    let data_bubble = getBubbleData(data.names[0]);
    Plotly.newPlot('bubble', data_bubble.trace, data_bubble.layout); 

    let data_meta = getMetaData(data.names[0]);
    DemographicInfoPanel(data_meta); 
});