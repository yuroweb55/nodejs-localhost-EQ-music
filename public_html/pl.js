const socket = io();
let plpp=0;
let fdgkof='';
function isTV() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('tv') || userAgent.includes('smarttv') || userAgent.includes('appletv') || userAgent.includes('hbbtv');
}



const randomNumber = 'pl-'+Math.floor(10000 + Math.random() * 90000);

const video = document.getElementById('video');
const nextvideo = document.getElementById('nextvideo');
const buttonplkk = document.getElementById('buttonplkk');
const timee = document.getElementById('timee');
const vdo_name = document.getElementById('vdo-name');
const vr_text = document.getElementById('vr-text');
const eqvr = document.getElementById('eqvr');

if(isTV()){
  document.getElementById('gghf').style.display='none';
  document.getElementById('vuMeter').style.display='none';
}
eqvr.addEventListener('input', function() {
    const vr = eqvr.value;
    socket.emit('vr',{a:vr,b:randomNumber});
    video.volume=Number(vr)/1.4;
    vr_text.textContent= parseInt(Number(vr)*100);
});

socket.on('vr', (d) => {
   if(d.b===randomNumber){return}
   video.volume= Number(d.a)/1.4;
   eqvr.value= Number(d.a);
   vr_text.textContent= parseInt(Number(d.a)*100);
});



socket.on('invdo-next', (d) => {
    if(d.ty === 'in') {
        gofdkgoo(d.data);
        fetch('/video?id='+d.data.idvideo+'&d=1');
    } else if(d.ty === 'dl') {
        const div = document.getElementById('hhf-' + d.id);
        if (div) {
            div.remove();
        }
    }
});

function gofdkgoo(dd){
    const div = document.createElement('div');
    div.id='hhf-'+dd.idvideo;
    div.classList.add('card');
    div.classList.add('col-md-5');
    div.classList.add('col-yta');
    div.innerHTML=`
        <a onclick="nosvisrr_Q('${dd.idvideo}')" style="padding-top: 5px;text-decoration: none;">
            <img style="border-radius: 10px;" loading="lazy" class="card-img-top" src="${dd.img}" alt="img">
            <div class="card-body" style="text-align: left;">
                <h class="card-title">${dd.text}</h><br>
                <h class="card-text card-textsy">
                    <img style="border-radius: 50%;" loading="lazy" width="30" height="30" src="${dd.climg}" alt="img">
                    ${dd.cltext}
                </h> 
            </div>
        </a>
    `;
    nextvideo.appendChild(div);
}

  function nosvisrr_Q(id){
    swal({
        title: "คุณต้องการทำอะไร?",
        buttons: {
            playNow: {
                text: "เล่นตอนนี้",
                value: "playNow",
            },
            playNext: {
                text: "ลบเพลงนี้",
                value: "playNext",
            },
        },
    }).then( (value) => {
      
        if (value == 'playNow') {
          socket.emit('setvideo-a', id);
        } else if (value == 'playNext') {
          socket.emit('dl-invdo-next', id);
        }    
      
    });
  }

socket.on('setplpes-r', (d) => {
    if(d == 1) {
      buttonplkk.className = 'btn btn-danger';
      buttonplkk.textContent = 'หยุด';
    } else {
      buttonplkk.className = 'btn btn-success';
      buttonplkk.textContent = 'เล่น';
    }  
});

socket.on('set-s-e', (d) => {
    timee.textContent=`${ms_to_s(d.t)} / ${ms_to_s(d.e)}`;
});


function hkgkhf(d){
    if(d && d.length>0){
        d.forEach(e => {
            gofdkgoo(e);
        });
    }
}


if (!isTV()) {
  console.log("This device is a TV.");


  const eq32 = document.getElementById('eq32');
  const eq64 = document.getElementById('eq64');
  const eq125 = document.getElementById('eq125');
  const eq250 = document.getElementById('eq250');
  const eq500 = document.getElementById('eq500');
  const eq1k = document.getElementById('eq1k');
  const eq2k = document.getElementById('eq2k');
  const eq4k = document.getElementById('eq4k');
  const eq8k = document.getElementById('eq8k');
  const eq16k = document.getElementById('eq16k');


  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(video);

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.7;
  source.connect(gainNode);

  const filters = [
      { freq: 32, gain: eq32 },
      { freq: 64, gain: eq64 },
      { freq: 125, gain: eq125 },
      { freq: 250, gain: eq250 },
      { freq: 500, gain: eq500 },
      { freq: 1000, gain: eq1k },
      { freq: 2000, gain: eq2k },
      { freq: 4000, gain: eq4k },
      { freq: 8000, gain: eq8k },
      { freq: 16000, gain: eq16k },
  ].map(({ freq, gain }) => {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.gain.value = parseFloat(gain.value) || 0;

    gain.addEventListener('input', () => {
      filter.gain.value = parseFloat(gain.value);
    });
    return filter;
    
  });

  gainNode.connect(filters[0]);

  for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
    
  }



  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  filters[filters.length - 1].connect(analyser);

  analyser.connect(audioContext.destination);


  

  video.addEventListener('play', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

  });

  function setEQFromJSON(eqSettings) {
    Object.keys(eqSettings).forEach(key => {
      const gainControl = document.getElementById(key);
      if (gainControl) {
        gainControl.value = eqSettings[key];
        const filter = filters.find(f => f.frequency.value === parseInt(key.replace('eq', '').replace('k', '000')));
        if (filter) {
          filter.gain.value = parseFloat(eqSettings[key]);
        }
      }
    });
  }

}



video.addEventListener('timeupdate', function() {
    socket.emit('set-s-e-k',{t:video.currentTime,e:video.duration});
});

socket.on('setplpes', () => {
    if (plpp == 0) {
        video.play();
        plpp=1;
    } else {
        video.pause();
        plpp=0;
    }
});

buttonplkk.addEventListener('click', () => {
    socket.emit('setpl-pe',1);
});

video.addEventListener('play', function() {
    socket.emit('setplss',1);
});
video.addEventListener('ended', function() {
    socket.emit('setplss',0);
    socket.emit('roidvdo-new',1);
});
var ighfioh=1;

socket.on('goivdo-new', (d) => {
  if(ighfioh===1){
    ighfioh=0;
    socket.emit('setplss',0);
    socket.emit('roidvdo-new',1);    
  }
});

socket.on('roidvdo-new', (d) => {
  ighfioh=1;
  if(d && d!='n.'){
    socket.emit('setvideo-a', d);
    socket.emit('dl-invdo-next', d);
  }else{
    socket.emit('setvideo-a', fdgkof);
  }
});

video.addEventListener('pause', function() {
    socket.emit('setplss',0);
});

socket.on('setHz', (data) => {
    const d = JSON.parse(data).a;
    setEQFromJSON(d);
});
socket.on('set-videon', (d) => {
    fdgkof=d.nextid;
    video.src = '/video?id='+d.id;
    video.poster = d.img;
    vdo_name.textContent=d.title;
});

video.addEventListener('loadedmetadata', function() {
    video.play();
})




// เมื่อได้รับข้อมูล EQ จากเซิร์ฟเวอร์
socket.on('setdataplay', (data) => {
    const d = JSON.parse(data);
    if (!isTV()){setEQFromJSON(d)};
    if(d.dvdo && d.dvdo.nextid && d.dvdo.id){
        fdgkof=d.dvdo.nextid;
        video.src = '/video?id='+d.dvdo.id;
        video.poster =d.dvdo.img;
        vdo_name.textContent=d.dvdo.title;
    }
    // ตั้งค่า EQ controls ตามข้อมูลที่ได้รับ
    eq32.value = d.eq32;
    eq64.value = d.eq64;
    eq125.value = d.eq125;
    eq250.value = d.eq250;
    eq500.value = d.eq500;
    eq1k.value = d.eq1k;
    eq2k.value = d.eq2k;
    eq4k.value = d.eq4k;
    eq8k.value = d.eq8k;
    eq16k.value = d.eq16k;
    hkgkhf(d.dvne);
    if(d.plpp==1){
        buttonplkk.className = 'btn btn-danger';
        buttonplkk.textContent = 'หยุด';
      } else {
        buttonplkk.className = 'btn btn-success';
        buttonplkk.textContent = 'เล่น';
      }
   video.volume= Number(d.plvr)/1.4;
   eqvr.value= Number(d.plvr);
   vr_text.textContent= parseInt(Number(d.plvr)*100);
});

// ส่งข้อมูลเริ่มต้นเมื่อโหลดหน้าเว็บ
socket.emit('setplay', 1);



function ms_to_s(t) {
    if (isNaN(t)) {
        return "0:00:00"
    }
    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t % 3600) / 60);
    const seconds = Math.floor(t % 60);
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }




