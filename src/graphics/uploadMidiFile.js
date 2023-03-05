async function UploadFile(inp) 
{
    let formData = new FormData();
    let midifile = inp.files[0];      
         
    formData.append("midifile", midifile);
    
    const ctrl = new AbortController()    // timeout
    setTimeout(() => ctrl.abort(), 5000);
    
    try {
       let r = await fetch('/upload/file', 
         {method: "POST", body: formData, signal: ctrl.signal}); 
       console.log('HTTP response code:',r.status); 
    } catch(e) {
       console.log('Houston we have problem...:', e);
    }
}

player.src = UploadFile(inp);

const loadMIDI = (FILE_URL, async = true, type = "text/javascript") => {
    return new Promise((resolve, reject) => {
        try {
            const scriptEle = document.createElement("script");
            scriptEle.type = type;
            scriptEle.async = async;
            scriptEle.src =FILE_URL;

            scriptEle.addEventListener("load", (ev) => {
                resolve({ status: true });
            });

            scriptEle.addEventListener("error", (ev) => {
                reject({
                    status: false,
                    message: `Failed to load the script ＄{FILE_URL}`
                });
            });

            document.body.appendChild(scriptEle);
        } catch (error) {
            reject(error);
        }
    });
};

loadMIDI("file1_url")
    .then( data  => {
        console.log("Script loaded successfully", data);
    })
    .catch( err => {
        console.error(err);
    });

loadSongArray()
    .then (data => {
        console.log("Script loaded successfully", data)
    })
    .catch( err => {
        console.error(err);
    });


/* need command to search through firebase library and select song */
/* once song is selected it will pull up modified midi file and music array */