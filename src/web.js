const phantom = require("phantom");

async function getYeet(url, debug) {

    var steps=[];
    var testindex = 0;
    var loadInProgress = false;

    const instance = await phantom.create();
    const page = await instance.createPage();
    

    // Declare phantom listeners
    await page.on("onLoadStarted", function() {
        loadInProgress = true;
        console.log('Loading started');
    });
    await page.on("onLoadFinished", function() {
        loadInProgress = false;
        console.log('Loading finished');
    });
    if (debug) {
        await page.on("onResourceRequested", function(requestData) {
            console.info('Requesting', requestData.url)
        });
        await page.on("onConsoleMessage", function(msg) {
            console.log(msg);
        });
    }
    

    // Steps to execute
    steps = [
 
        //Step 1 - Login
        async function(){
            if (await page.open(url) === "success") {
                await page.evaluate(function(){
                    document.getElementById("login_Login_1e1").value="";
                    document.getElementById("login_Login_1e2").value="";
                    document.forms[1].submit();
                });
                return true;
            }
            return false;
        },

        //Step 2 - Open MaterialPlayer with acessible test data.
        async function(){
            if (await page.open(url) === "success") {
                const content = await page.evaluate(function(){
                    barSmartLoadPage(barEncLink(`/elearning/?cmd=MaterialPlayer&superid=${}`));
                    return ETestUtils.cardsData;
                });
                console.log(content);
                return true;
            }
            return false;
        }
    ];

    //Execute steps one by one
    interval = setInterval(await executeRequestsStepByStep,5000);
    
    async function executeRequestsStepByStep(){
        if (testindex < steps.length) {
            if (loadInProgress == false && typeof steps[testindex] == "function") {
                //console.log("step " + (testindex + 1));
                await steps[testindex]();
                testindex++;
            }
        }
    }
}

getYeet("https://gamca.edupage.org/elearning/?eqa=Y21kPUVUZXN0Q3JlYXRvciZwbGFuaWQ9Mjc0NiZ0ZXN0aWQ9MjU0MzE3JnN1cGVyaWQ9MTMzNDM1JmNzcG9obGFkU3RhcnQ9dGVzdHMmcG9obGFkPXJlc3VsdHMlM0FvdmVydmlldyZldGVzdFR5cGU9MCZlZGl0PQ%3D%3D", false);