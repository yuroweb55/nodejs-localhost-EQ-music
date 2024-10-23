const socket = io();

const randomNumber = Math.floor(10000 + Math.random() * 90000);


const video = document.getElementById('video');
const buttonplkk = document.getElementById('buttonplkk');
const timee = document.getElementById('timee');
const out_search_text= document.getElementById('earch-txt');
const search_n= document.getElementById('search-');
const gkprd= document.getElementById('gkprd');
const vdo_name = document.getElementById('vdo-name');
const nextvideo = document.getElementById('nextvideo');
const vr_text = document.getElementById('vr-text');
const eqvr = document.getElementById('eqvr');
const govdo__new = document.getElementById('govdo--new');

eqvr.addEventListener('input', function() {
    const vr = eqvr.value;
    socket.emit('vr',{a:vr,b:randomNumber});
    vr_text.textContent= parseInt(Number(vr)*100);
});

socket.on('vr', (d) => {
    if(d.b===randomNumber){return}
    eqvr.value=Number(d.a);
    vr_text.textContent= parseInt(Number(d.a)*100);
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

function hkgkhf(d){
  if(d && d.length>0){
      d.forEach(e => {
          gofdkgoo(e);
      });
  }
}


socket.on('invdo-next', (d) => {
  if(d.ty === 'in') {
      gofdkgoo(d.data);
      cs_sq();
  } else if(d.ty === 'dl') {
    const div = document.getElementById('hhf-' + d.id);
    if (div) {
        div.remove();
    }
  }  else if(d.ty === 'e.') {
    cs_sq();
    swal("Error", d.t, "error");
  }
});

govdo__new.addEventListener('click', () => {
    socket.emit('govdo-new',1);
  });
buttonplkk.addEventListener('click', () => {
  socket.emit('setpl-pe',1);
});

socket.on('setplpes-r', (d) => {
  if(d == 1) {
    video.play();
    buttonplkk.className = 'btn btn-danger';
    buttonplkk.textContent = 'หยุด';
  } else {
    video.pause();
    buttonplkk.className = 'btn btn-success';
    buttonplkk.textContent = 'เล่น';
  }  
});

socket.on('set-s-e', (d) => {
  video.play();
  timee.textContent=`${ms_to_s(d.t)} / ${ms_to_s(d.e)}`;
  if (Math.abs(d.t - video.currentTime) > 0.1) {
    video.currentTime = d.t+0.15
  }
});












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


// ฟังก์ชันสำหรับส่งข้อมูล EQ
function sendEQData() {
    const eqData = {
      eq32: eq32.value,
      eq64: eq64.value,
      eq125: eq125.value,
      eq250: eq250.value,
      eq500: eq500.value,
      eq1k: eq1k.value,
      eq2k: eq2k.value,
      eq4k: eq4k.value,
      eq8k: eq8k.value,
      eq16k: eq16k.value,
    };

    // ส่งข้อมูล EQ ผ่าน Socket.IO
    socket.emit('setHzi', {a:eqData,b:randomNumber});
}


socket.on('setHz', (data) => {
  const d = JSON.parse(data);
  if(d.b===randomNumber){return}
  eq32.value = d.a.eq32;
  eq64.value = d.a.eq64;
  eq125.value = d.a.eq125;
  eq250.value = d.a.eq250;
  eq500.value = d.a.eq500;
  eq1k.value = d.a.eq1k;
  eq2k.value = d.a.eq2k;
  eq4k.value = d.a.eq4k;
  eq8k.value = d.a.eq8k;
  eq16k.value = d.a.eq16k;

});

// เพิ่ม Event Listener ให้กับ EQ controls
[eq32, eq64, eq125, eq250, eq500, eq1k, eq2k, eq4k, eq8k, eq16k].forEach(eq => {
    eq.addEventListener('input', sendEQData);
});

// เมื่อได้รับข้อมูล EQ จากเซิร์ฟเวอร์
socket.on('setdataplay', (data) => {
    const d = JSON.parse(data);
    
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
    gofdgo(d.dvdo);
    if(d.plpp==1){
        buttonplkk.className = 'btn btn-danger';
        buttonplkk.textContent = 'หยุด';
      } else {
        buttonplkk.className = 'btn btn-success';
        buttonplkk.textContent = 'เล่น';
      }
      eqvr.value= Number(d.plvr);
      vr_text.textContent= parseInt(Number(d.plvr)*100);
});

// ส่งข้อมูลเริ่มต้นเมื่อโหลดหน้าเว็บ
socket.emit('setplay', 2);


function ms_to_s(t) {
  if (isNaN(t)) {
      return "0:00:00"
  }
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = Math.floor(t % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}



function nosvisrr(id){
  swal({
      title: "คุณต้องการทำอะไร?",
      buttons: {
          playNow: {
              text: "เล่นตอนนี้",
              value: "playNow",
          },
          playNext: {
              text: "เล่นเป็นเพลงถัดไป",
              value: "playNext",
          },
      },
  }).then( (value) => {
    
      if (value == 'playNow') {
        out_search_text.innerHTML = "<h5>โหลดvideo...</h5><br><div class='spinb'><div class='spinner'></div></div>";
        socket.emit('setvideo-a', id);
        
      } else if (value == 'playNext') {
        socket.emit('setvideo-b', id);
        out_search_text.innerHTML = "<div class='spinb'><div class='spinner'></div></div>";
      }    
    
  });
}
socket.on('set-videon', (d) => {
  gofdgo(d)
});

function gofdgo(d){
  if(!d.id){return}
  video.src = '/video?id='+d.id;
  video.poster =d.img;
  vdo_name.textContent=d.title;
  cs_sq();
}









var com_net = 1;
var recentVideos = [];




function showRecentVideos() {
  out_search.innerHTML = "";
  var html = "";
  var id_text = 1;
  txt_max = 1;
  recentVideos.forEach(function(video) {
      html += ` <a id="ttq_${id_text}" onclick="sq('${video.title.replace(/'/g, "\\'")}','1')" class="dropdown-item d-flex align-items-center"> ${video.title} </a> `;
      id_text++;
      txt_max++;
      out_search.classList.add("show")
  });
  if (id_text != 1) {
      html += ` <a onclick="ลบข้อมูลที่search()" class="dropdown-item d-flex align-items-center fgiho"> ลบข้อมูลที่search </a> `
  }
  out_search.innerHTML = html
}
function nfsearch() {
  if (form_input_search.style.display == "flex") {
      form_input_search.style.display = 'none'
  } else {
      form_input_search.style.display = 'flex'
  }
}
input_search.addEventListener('input', function() {
  hkgfhotext = input_search.value;
  if (input_search.value != "") {
      gfodjghifdii(input_search.value)
  } else {
      out_search.classList.remove("show")
  }
});

function gfodjghifdii(text) {
  if (com_net == 1) {
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              text: text
          })
      };
      fetch('/api/next-word', options).then(response => response.json()).then(data => {
          out_search.classList.add("show");
          nntextq = 0;
          const dataList = data.d;
          let html = '';
          var id_text = 1;
          dataList.forEach(item => {
              if (id_text === 1) {
                  txtq_1 = item.text_q;
                  txt_max = 1
              }
              if (id_text === 2) {
                  txtq_2 = item.text_q;
                  txt_max = 2
              }
              if (id_text === 3) {
                  txtq_3 = item.text_q;
                  txt_max = 3
              }
              if (id_text === 4) {
                  txtq_4 = item.text_q;
                  txt_max = 4
              }
              if (id_text === 5) {
                  txtq_5 = item.text_q;
                  txt_max = 5
              }
              if (id_text === 6) {
                  txtq_6 = item.text_q;
                  txt_max = 6
              }
              if (id_text === 7) {
                  txtq_7 = item.text_q;
                  txt_max = 6
              }
              var hbjgoffjh = "";
              if (item.to_text1 != "n") {
                  hbjgoffjh = item.to_text1
              }
              html += `<a id="ttq_${id_text}" onclick="sq('${item.text_q.replace(/'/g, "\\'")}','1')" class="dropdown-item d-flex align-items-center"><b>${item.to_text0}</b>${hbjgoffjh}</a>`;
              id_text++
          }
          );
          out_search.innerHTML = html
      }
      ).catch(error => {
          out_search.textContent = 'ไม่พบข้อมูล';
          txt_max = ""
      }
      )
  } else {
      notnet()
  }
}
function text_cl(t) {
  if (txt_max != "") {
      if (nntextq != 0) {
          if (t === 1) {
              input_search.value = txtq_1
          }
          if (t === 2) {
              input_search.value = txtq_2
          }
          if (t === 3) {
              input_search.value = txtq_3
          }
          if (t === 4) {
              input_search.value = txtq_4
          }
          if (t === 5) {
              input_search.value = txtq_5
          }
          if (t === 6) {
              input_search.value = txtq_6
          }
          if (t === 7) {
              input_search.value = txtq_7
          }
          document.getElementById("ttq_" + t).style.backgroundColor = "#e9ecef";
          for (var i = 1; i <= txt_max; i++) {
              if (i != t) {
                  document.getElementById("ttq_" + i).style.backgroundColor = ""
              }
          }
      } else {
          document.getElementById("ttq_1").style.backgroundColor = "";
          input_search.value = hkgfhotext
      }
  }
}
input_search.addEventListener('keydown', function(event) {
  if (event.key === "ArrowUp") {
      event.preventDefault();
      if (nntextq > 0) {
          nntextq--;
          text_cl(nntextq)
      }
  } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (nntextq < txt_max) {
          nntextq++;
          text_cl(nntextq)
      }
  }
});
form_input_search.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (input_search.value != "") {
      sq(input_search.value, '1')
  }
}
);
input_search.addEventListener('focus', function() {
  if (out_search.textContent != "" || out_search.textContent == "ไม่พบข้อมูล") {
      out_search.classList.add("show")
  }
  if (input_search.value == "") {
      showRecentVideos()
  }
});
input_search.addEventListener('blur', function() {
  setTimeout(function() {
      out_search.classList.remove("show")
  }, 250)
});
function cs_sq(){
  gkprd.style.display='none';
  search_n.style.display='none';
  out_search_text.innerHTML = "";
  document.body.style.overflow = '';
}
function sq(text, oo) {
  if (com_net == 1) {
       input_search.value=text;
      gkprd.style.display='';
      search_n.style.display='';
      out_search_text.innerHTML = "<div class='spinb'><div class='spinner'></div></div>";
      out_search.classList.remove("show");
      document.body.style.overflow = 'hidden';
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              var json = JSON.parse(xhr.responseText);
              if (xhr.status === 200) {
                  out_search_text.innerHTML = "";
                  json.forEach(video => {
                      if (video.video || video.videos) {
                          if (video.video) {
                              video = video.video
                          } else {
                              video = video.videos
                          }
                          var ta;
                          var tb;
                          if (video.videotime == "Error") {
                              ta = "ไม่พบข้อมูล"
                          } else {
                              ta = video.videotime.a
                          }
                          if (video.view == "Error") {
                              tb = "ไม่พบข้อมูล"
                          } else {
                              tb = video.view
                          }
                          const videoElement = document.createElement('div');
                          videoElement.classList.add('card');
                          videoElement.classList.add('col-md-3');
                          videoElement.classList.add('col-yta');
                          videoElement.innerHTML = `
                            <a onclick="nosvisrr('${video.idvideo}')" style="padding-top: 5px;text-decoration: none;">
                                <img style="border-radius: 10px;" loading="lazy" class="card-img-top" src="${video.img[0].url}" alt="img">
                                <div class="card-body">
                                  <h class="card-title">${video.title}</h>
                                  <h class="card-text"><br>
                                  <img loading="lazy" alt="img" class="ddds" src="${video.channel.img[0].url}">
                                    <h clas="hgc_icon">${video.channel.text}
                                      <img class="hgc_icons" src="https://fkwapp.com/yweb.music/ic/gc_icon.svg" loading="lazy" alt="img">
                                    </h>
                                  </h><br> 
                                  <h class="card-text"> ${tb} • ${ta} </h>
                                </div>
                            </a>
                          `;
                          out_search_text.appendChild(videoElement)
                      }
                  }
                  )
              } else {
                  swal("Error", json.error, "error")
              }
          }
      }
      ;
      xhr.open('POST', 'api/search', !0);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send('q=' + text + "&language=th")
  } else {
      notnet()
  }
}



if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.querySelectorAll('.lloo').forEach(e => {
        e.classList.add('mobile')
    });
}

  