let recorder=null, chunks=[], recordingStream=null;
async function startRecording(){
  if(!navigator.mediaDevices?.getUserMedia){toast("Tu navegador no permite grabación de audio.");return;}
  try{
    recordingStream=await navigator.mediaDevices.getUserMedia({audio:true});
    recorder=new MediaRecorder(recordingStream); chunks=[];
    recorder.ondataavailable=e=>chunks.push(e.data);
    recorder.onstop=()=>{
      const blob=new Blob(chunks,{type:"audio/webm"}), url=URL.createObjectURL(blob);
      window.lastRecording={blob,url,date:new Date().toISOString()};
      document.dispatchEvent(new CustomEvent("recording-ready",{detail:{url}}));
      recordingStream.getTracks().forEach(t=>t.stop());
    };
    recorder.start(); document.dispatchEvent(new Event("recording-started")); toast("Grabación iniciada");
  }catch(e){toast("No se pudo acceder al micrófono. Revisa los permisos del navegador.");}
}
function stopRecording(){if(recorder?.state==="recording"){recorder.stop();toast("Grabación detenida");}}
function playLastRecording(){if(window.lastRecording?.url)new Audio(window.lastRecording.url).play();else toast("Todavía no tienes una grabación.");}