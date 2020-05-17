import phantom from 'phantom';
import { isMainThread } from 'worker_threads';

export default async function(url: string, debug: boolean) {
    const instance = await phantom.create();
    const page = await instance.createPage();
    if (debug) {
        await page.on("onResourceRequested", function(requestData) {
            console.info('Requesting', requestData.url)
        });
    }

    if (await page.open(url) === "success") {
        console.log("Succesfully connected");
        const content = await page.evaluate(function(){
			document.getElementById("ap_email")!!.value=" ";
            document.getElementById("ap_password")!!.value=" ";
            document.getElementById("ap_signin_form")!!.();
		});
        console.log(content);
    } else {
        console.log("Unable to connect");
    }

    document.body

    await instance.exit();
}