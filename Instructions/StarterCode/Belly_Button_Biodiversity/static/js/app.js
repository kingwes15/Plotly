function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`
  d3.json(url)
    .then(function(element){
      // Use d3 to select the panel with id of `#sample-metadata`
      console.log(element)

      // Use `.html("") to clear any existing metadata
      d3.select("#sample-metadata").html("")

      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(element).forEach(([key, value]) =>{
        d3.select("#sample-metadata").append("h6").text(`${key}: ${value}`)
        // console.log(`Key: ${key}, and value ${value}`)
      })

      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
    })
    .catch(error => {console.log(error)})
}



function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url)
    .then(function(chart){
      console.log(chart)
      // create array for each object key
      var otu_ids = chart.otu_ids
      var otu_labels = chart.otu_labels
      var sample_values = chart.sample_values

      // create a sortable array of objects from unsortable object with arrays for values
      var array = []
      for(var i = 0; i < sample_values.length; i++){
        array.push({
          otu_ids: otu_ids[i],
          otu_labels: otu_labels[i],
          sample_values: sample_values[i]
        })}
      // console.log(array)
      
      //Sort Newly created array
      console.log(array.sort((a,z) => z.sample_values - a.sample_values))
      // Select top 10 samples only using slice
      var data = array.slice(0,10)

      // @TODO: Build a Bubble Chart using the sample data
      // Map the labels to create Bubble chart
      var samples = array.map(row => row.sample_values)
      var ids = array.map(row => row.otu_ids)
      var labels = array.map(row => row.otu_labels)
      // console.log(samples)
      // console.log(ids)
      // console.log(labels)
      var bubbleData = [{
        x: ids,
        y: samples,
        mode: "markers",
        marker:{
          size: samples,
          color: ids
        },
        text: labels
      }]
      var bubbleLayout = {
        xaxis:{title: "OTU ID"}
      }
      Plotly.newPlot("bubble", bubbleData, bubbleLayout)

      // @TODO: Build a Pie Chart
      // Map the labels to create Pie chart
      var samplesTop10 = data.map(row => row.sample_values)
      var idsTop10 = data.map(row => row.otu_ids)
      var labelsTop10 = data.map(row => row.otu_labels)
      // console.log(samplesTop10)
      // console.log(idsTop10)
      // console.log(labelsTop10)

      var pieData = [{
          values: samplesTop10,
          labels: idsTop10,
          type: "pie",
          hovertext: labelsTop10
      }]
      Plotly.newPlot("pie", pieData)

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    })
    .catch(error => (console.log(error)))

}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
