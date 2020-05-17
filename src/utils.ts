var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

export default function isValidUrl(url: string) {
    if (!!pattern.test(url)) {
        if (url.includes('edupage')) {
            return true;
        } else {
            console.log("The provided url is not valid edupage url.")
        }
    } else {
        console.log("Invalid url address provided.")
    }
    return false;
}