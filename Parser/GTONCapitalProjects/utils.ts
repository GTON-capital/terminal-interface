
export function makeRequest(method, url) {
    return new Promise( (resolve, reject) =>  {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload =  () => {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
  }