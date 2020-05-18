const phantom = require("phantom");
var ora = require('ora');

async function getYeet(url, verbose, debug) {
    var load = ora("Loading page & phantom instance").start();

    var logged = false;

    const instance = await phantom.create([], {
        logLevel: 'info',
    });
    const page = await instance.createPage();

    page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36');
    page.setting('javascriptEnabled', true);
    page.setting('loadImages', false);

    load.text = "Page & phantom instance loaded";
    load.succeed();
    load = ora("Setting up").start();

    // Declare phantom listeners
    await page.on("onLoadStarted", function() {
        
    });
    await page.on("onLoadFinished", async function() {

    });
    if (debug) {
        await page.on("onResourceRequested", function(requestData) {
            console.info('Requesting', requestData.url)
        });
    }
    if (verbose) {
        await page.on("onConsoleMessage", function(msg) {
            console.log(`\n${msg}`);
        });
    }
    
    load.text = "All set";
    load.succeed();
    load = ora("Logging in").start();

     //Step 1 - Login
     if (await page.open(url).catch((error) => {
        load.text = "An error occured while opening login page"
        load.fail(); 
        console.error(error);
        return false;
    }) === "success") {
        await page.evaluateAsync(function(){
            document.getElementById("login_Login_1e1").value="AdamGramblicka";
            document.getElementById("login_Login_1e2").value="RSEXPCQHXB";
            document.forms[1].submit();
        }).catch((error) => {
            load.text = "An error occured while logging in"
            load.fail();
            console.error(error);
            return false;
        });
    }

    load.text = "Logged in";
    load.succeed();
    load = ora("Acessing url").start();

    console.warn("\n STARTING TIMEOUT");
    await timeout(15000);
    console.warn("\n STARTING DATA CHECK");

    //Step 2 - Open MaterialPlayer with acessible test data. 
    if (await page.open(url).catch((error) => {
        load.text = "An error occured while checking target page"
        load.fail(); 
        console.error(error);
        return false;
    }) === "success") {
        await page.evaluateJavaScript('function() { return ETestUtils.cardsData; }').then(function(data){
            console.warn(`\n${data}`);
        });

        load.text = "Data obtained";
        load.succeed();
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

getYeet("https://gamca.edupage.org/elearning/?eqa=Y21kPUVUZXN0Q3JlYXRvciZwbGFuaWQ9Mjc0NiZ0ZXN0aWQ9MjU0MzE3JnN1cGVyaWQ9MTMzNDM1JmNzcG9obGFkU3RhcnQ9dGVzdHMmcG9obGFkPXJlc3VsdHMlM0FvdmVydmlldyZldGVzdFR5cGU9MCZlZGl0PQ%3D%3D", true, false);