// create the function that gets the data and creates the plots for the id 
function getPlot(id) {
    
    // get the data from the json file
    d3.json("samples.json").then((sampleddata)=> {
        console.log(sampleddata)

        // filter sample values by id 
        var samples = sampleddata.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // gathering the top 10 samples and their ids in rever
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        // console.log(samplesValues)
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();
        // console.log(idValues)
        // mapping the id values to eachother
        var idOtu = idValues.map(d => "OTU " + d)

        console.log(`OTU IDS: ${idOtu}`)

        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

        console.log(`Values: ${sampleValues}`)
        console.log(`Ids : ${idValues}`)

        
        // creating horizontal plot with the top 10 samples values and ids
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);
        
        // trace for the bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width: 1200
        };

        // create the data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout); 


     });    
}
    
function getInfo(id) {
    // reads json file to gather all the necessary data
    d3.json("samples.json").then((sampleddata)=> {
        
        // grabs metadata from the metadata variable in the json file
        var metadata = sampleddata.metadata;

        console.log(metadata)

        // filter meta data info by id
        var demo = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var metaInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        metaInfo.html("");

        // grab the necessary demographic data and append the info to the panel
        Object.entries(demo).forEach((key) => {   
                metaInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// this function will gather all the changed ids if you go to a different sample
// obtains the id from the plot and info functions
function optionEvent(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((sampleddata)=> {
        console.log(sampleddata)

        // get the id data to the dropdwown menu
        sampleddata.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(sampleddata.names[0]);
        getInfo(sampleddata.names[0]);
    });
}

init();