
const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const fs = require('fs');
const socketIo = require('socket.io');
const http = require('http');
const axios = require('axios');
const compression = require('compression');
const bodyParser = require('body-parser');



const app = express();
app.use(express.json());
app.use(compression());

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 80;

const cacheDir = path.join('E:','192.168.2.2'); // เกฌบไฟล์vieo
const pasavedata = 'databass';
const gfdgf = path.join(__dirname, pasavedata, 'dataall.txt'); // เก็บ eq
const gfdvr = path.join(__dirname, pasavedata, 'datavr.txt'); // เก็บ eq
const gfdgg = path.join(__dirname, pasavedata, 'datapl.txt'); // pl*-0-1
const gfdgh = path.join(__dirname, pasavedata, 'datacdo.txt'); //ข้อมูล vdo
const gfdgi = path.join(__dirname, pasavedata, 'datavdne.txt'); //ข้อมูล vdoต่อไป
const gfdHi = path.join(__dirname, pasavedata, 'log-play-video.txt'); //ข้อมูล vdoที่เลยเล่น

let plpp = 0;
let plvr = 0;
let dvdo = {};
let dvne = [];
let datahl = [];

fs.readFile(gfdgg,'utf8',(err, data)=>{if(err){console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:',err);return}try{plpp=parseInt(data)}catch(error){console.error('gfdgg:',error)}});
fs.readFile(gfdgh,'utf8',(err, data)=>{if(err){console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:',err);return}try{dvdo=JSON.parse(data)}catch(error){console.error('gfdgh:',error)}});
fs.readFile(gfdgi,'utf8',(err, data)=>{if(err){console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:',err);return}try{dvne=JSON.parse(data)}catch(error){console.error('gfdgh:',error)}});
fs.readFile(gfdHi,'utf8',(err, data)=>{if(err){console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:',err);return}try{
  data=data.replace(/\n/g, '');
  if (data.endsWith(",")) {
    data = data.slice(0, -1);
  }
  datahl=JSON.parse('[' + data + ']').map(e => e.id);
}catch(error){console.error('gfdgh:',error)}});
fs.readFile(gfdvr,'utf8',(err, data)=>{if(err){console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:',err);return}try{plvr=Number(data)}catch(error){console.error('gfdgg:',error)}});


io.on('connection', (socket) => {

  socket.on('govdo-new',(d) => {
    io.emit('goivdo-new', d);
  });

  socket.on('vr',(d) => {
    fs.writeFile(gfdvr, ''+d.a, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        plvr=Number(d.a);
        io.emit('vr', d);
      }
    });
  });

  socket.on('roidvdo-new',() => {
    if(dvne.length>0){
      const id = dvne[0].idvideo;
      socket.emit('roidvdo-new', id);
    }else{
      socket.emit('roidvdo-new', 'n.');
    }
  });

  socket.on('dl-invdo-next', async (id) => {
      dvne=dvne.filter(i => i.idvideo !== id);

      fs.writeFile(gfdgi, JSON.stringify(dvne), (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          io.emit('invdo-next', {ty:'dl',id});
        }
      });
  });

  socket.on('setvideo-b', async (id) => {
    id=id.trim();
    const gg = dvne.filter(i => i.idvideo === id);
    if(gg.length>0 || dvdo.id===id){return io.emit('invdo-next', {ty:'e.',t:'มีเพลงนี้แล้วหรือเล่นเพลงนี้อยู่'})}
    console.log('dddd',id);

    const info = await nextvdoid(id);
    if(info && info!='e.'){
      dvne.push(info);
      fs.writeFile(gfdgi, JSON.stringify(dvne), (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          io.emit('invdo-next', {ty:'in',id,data:info});
        }
      });
    }
  });

  socket.on('setvideo-a', async (id) => {
    try {
      const info = await ytdl.getInfo(id);
      let nextId = '', urlImg = '';
      const poi = info.related_videos || []; 
      if (poi.length > 0) {
        const pois = poi.filter(i => datahl.includes(i.id));

        if (pois.length > 0) {
          if(Math.floor(Math.random() * 4)>0){
            nextId = pois[Math.floor(Math.random() * pois.length)].id;
          }else{
            nextId = poi[Math.floor(Math.random() * poi.length)].id;
          }
        }else{
          nextId = poi[Math.floor(Math.random() * poi.length)].id;
        }
        
      } 
      const invf = info.videoDetails;

      if (invf.thumbnails.length > 0) {
        urlImg = invf.thumbnails.pop().url;
      }

      dvdo={
        title: invf.title,
        id: invf.videoId,
        nextid: nextId,
        img: urlImg,
      };
      fs.writeFile(gfdgh, JSON.stringify(dvdo), (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          fetch('http://127.0.0.1:'+PORT+'/video?id=' + id +'&d=1')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return; 
          })
          .then(() => {
            io.emit('set-videon', dvdo);
            fs.appendFile(gfdHi, JSON.stringify(dvdo)+',\n', (err) => {
              if (err) {
                console.error('เกิดข้อผิดพลาด:', err);
              } else {
                datahl.push(id);

                console.log('เพิ่มข้อมูลสำเร็จ!');
              }
            });
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        }
      });
    } catch (error) {
      console.error('Error fetching video info:', error);
    }
  });
  
  socket.on('set-s-e-k', (d) => {
    io.emit('set-s-e', d);
  });

  socket.on('setplss', (d) => {
    fs.writeFile(gfdgg, ''+d, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        plpp=d;
        io.emit('setplpes-r', d);
      }
    });
  });

  socket.on('setpl-pe', (data) => {
    io.emit('setplpes', 1);
  });

  socket.on('setHzi', (data) => {
    fs.writeFile(gfdgf, JSON.stringify(data.a), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        io.emit('setHz', JSON.stringify(data));
      }
    });
  });

  socket.on('setplay', (d) => {
    fs.readFile(gfdgf, 'utf8', (err, data) => {
      if (err) {
          console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:', err);
          return;
      }
      const g = JSON.parse(data);
      g.plpp=plpp;
      g.dvdo=dvdo;
      g.dvne=dvne;
      g.plvr=plvr;
      socket.emit('setdataplay',JSON.stringify(g));
    });
  });





});







let fdlgfplvdideo = [];

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

app.get('/video', (req, res) => {
  const videoId = req.query.id;

  if (!videoId) {
    return res.status(400).send('Missing video ID');
  }

  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const cacheFilePath = path.join(cacheDir, `${videoId}.mp4`);

  if (fs.existsSync(cacheFilePath)) {
    console.log(`Using cached file: ${cacheFilePath} IP:${req.ip}`);

    const stat = fs.statSync(cacheFilePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      // ถ้าไม่มี range request ให้ส่งไฟล์ทั้งหมด
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(cacheFilePath).pipe(res);
    } else {
      // ถ้ามี range request ให้จัดการ partial content
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.writeHead(416, {
          'Content-Range': `bytes */${fileSize}`,
        });
        return res.end();
      }

      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(cacheFilePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      file.pipe(res);
    }

  } else {
    if (fdlgfplvdideo.includes(videoId)) {
      return res.send(`Video is being downloaded.`);
    }
    fdlgfplvdideo.push(videoId);

    console.log(`Downloading video: ${url}`);
    const videoStream = ytdl(url, {
      filter: (format) => format.container === 'mp4' && format.hasAudio && format.hasVideo,
      quality: 'highestvideo',
    });

    const fileStream = fs.createWriteStream(cacheFilePath);
    videoStream.pipe(fileStream);

    videoStream.on('end', () => {
      fdlgfplvdideo = fdlgfplvdideo.filter(i => i !== videoId);
      console.log(`Downloaded and cached: ${cacheFilePath}`);
      res.send(`Downloaded and cached: ${cacheFilePath}`);
    });

    videoStream.on('error', (err) => {
      console.error('Error downloading video:', err);
      res.status(500).send('Error downloading video');
    });
  }
});








//-----------------------------------------------------------------
const headers_api_1={
  "accept": "*/*",
  "accept-language": "th",
  "content-type": "application/json",
  "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
  "sec-ch-ua-arch": "\"x86\"",
  "sec-ch-ua-bitness": "\"64\"",
  "sec-ch-ua-full-version": "\"123.0.6312.106\"",
  "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"123.0.6312.106\", \"Not:A-Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"123.0.6312.106\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": "\"\"",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-ch-ua-platform-version": "\"10.0.0\"",
  "sec-ch-ua-wow64": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "same-origin",
  "sec-fetch-site": "same-origin",
  "x-goog-visitor-id": "CgtHVWJFbHVFRGVTayjtz96wBjIKCgJUSBIEGgAgSA%3D%3D",
  "x-youtube-bootstrap-logged-in": "false",
  "x-youtube-client-name": "67",
  "x-youtube-client-version": "1.20240408.01.00",
  "cookie": "YSC=JOlh7f9n-yI; VISITOR_INFO1_LIVE=GUbEluEDeSk; VISITOR_PRIVACY_METADATA=CgJUSBIEGgAgSA%3D%3D; _gcl_au=1.1.1306658095.1712826350",
  "Referer": "https://music.youtube.com/",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};



async function emoj(str) {
	return [...str].map(char => {
	  const codePoint = char.codePointAt(0);
	   if (codePoint >= 0x1F600 || codePoint === 0x2705) {
		// แปลงเฉพาะอีโมจิในช่วงที่ต้องการ
		return `&#x${codePoint.toString(16)};`;
	  }
	  return char.replace(/[^a-zA-Zก-๙\s]/g, '');
	}).join('');
  }
app.post('/api/search', async (req, res) => {
  try {
	  var qs = req.body.q;
	  	if(qs && qs!=""){
			axios({
				url: "https://www.youtube.com/youtubei/v1/search?prettyPrint=false",
				method: "POST",
				"headers": headers_api_1,
				data:{
					"context": {
						"client": {
							"hl": "th",
							"gl": "TH",
							"userAgent": "-",
							"clientName": "WEB",
							"clientVersion": "2.20240228.06.00",
						},
					},
					"query": qs,
				}

			}).then((response) => {

				var jsonaii=response.data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;
				var continuationCommand_token=jsonaii[1].continuationItemRenderer.continuationEndpoint.continuationCommand;
				jsonaii=jsonaii[0].itemSectionRenderer.contents;
				var jsonaiis = [];
				jsonaii.forEach(data => {
					if(data.adSlotRenderer){

					}else if(data.channelRenderer){

					}else if(data.videoRenderer){

							var view="Error";
							var videotime="Error";
							var published="Error";
							if(data.videoRenderer.shortViewCountText){
								view=data.videoRenderer.shortViewCountText.simpleText; 
							}
							if(data.videoRenderer.lengthText){
								videotime={
									a:data.videoRenderer.lengthText.simpleText,
									b:data.videoRenderer.lengthText.accessibility.accessibilityData.label
								};
							}
							if(data.videoRenderer.publishedTimeText){
								published=data.videoRenderer.publishedTimeText.simpleTex;
							}
							var video={
								idvideo:data.videoRenderer.videoId,
								img:data.videoRenderer.thumbnail.thumbnails,
								title:data.videoRenderer.title.runs[0].text,

								view:view,
								videotime:videotime,
								published:published,

								channel:{
									text:data.videoRenderer.shortBylineText.runs[0].text,
									id:data.videoRenderer.shortBylineText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url.replace(/\//g, ""),
									img:data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
								},
							};
							jsonaiis.push({video:video});

					}else if(data.shelfRenderer){
						if(data.shelfRenderer.content.horizontalListRenderer){

						}else{
							data=data.shelfRenderer.content.verticalListRenderer.items;
							data.forEach(data => {
								if(data.videoRenderer.lengthText){
									var view="Error";
									var videotime="Error";
									var published="Error";
									if(data.videoRenderer.lengthText){
										videotime={
											a:data.videoRenderer.lengthText.simpleText,
											b:data.videoRenderer.lengthText.accessibility.accessibilityData.label
										};
									}
									if(data.videoRenderer.publishedTimeText){
										published=data.videoRenderer.publishedTimeText.simpleText
									}
									var video={
										idvideo:data.videoRenderer.videoId,
										img:data.videoRenderer.thumbnail.thumbnails,
										title:data.videoRenderer.title.runs[0].text,

										view:view,
										videotime:videotime,
										published:published,

										channel:{
											text:data.videoRenderer.shortBylineText.runs[0].text,
											id:data.videoRenderer.shortBylineText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url.replace(/\//g, ""),
											img:data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
										},
									};
									jsonaiis.push({videos:video});
								}
							});
						}

					}

				});
				res.json(jsonaiis);
			}).catch(error => {
				res.status(500).json({ error: error.message });
			});

	
		}else{
			res.status(400).json({ error: 'Failed to fetch data' });
		}
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/next-word', async (req, res) => {
		try {
			var s = req.body.text;
			s = await emoj(s);
				if(s && s!=""){
				
				axios({
					url: "https://music.youtube.com/youtubei/v1/music/get_search_suggestions?prettyPrint=false", 
					method: "POST",
						"headers": headers_api_1,
						data:{
							"input": s,
							"context": {
								"client": {
									"hl": "th",
									"gl": "TH",
									"userAgent": "-",
									"clientName": "WEB_REMIX",
									"clientVersion": "1.20240403.01.00",
								},
							}
						},
				}).then((response) => {
					const json_out = [];
					var json_main = response.data.contents[0].searchSuggestionsSectionRenderer;
					json_main.contents.forEach(data => {
						var dd=data.searchSuggestionRenderer;
						var to_text1='n';
						if(dd.suggestion.runs[1]){
							to_text1=dd.suggestion.runs[1].text
						}
						var suwvouj = {
							text_q: dd.navigationEndpoint.searchEndpoint.query,
							to_text0: dd.suggestion.runs[0].text,
							to_text1: to_text1,
						}
						json_out.push(suwvouj);
					});
	
					res.json({ t: json_main.contents.length, d: json_out });
	
				}).catch(error => {
          console.error(error);
					res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
				});
	
			}else{
				res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล มีพบ post text' });
			}
		} catch (error) {
      //console.error(error);
		  res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
		}
	});



async function nextvdoid(id){
	try {
		if (id && id !== "") {
			const [response_a, response_b] = await Promise.all([
			axios.post("https://www.youtube.com/youtubei/v1/next?prettyPrint=false", 
			{
				"context": {
				"client": {
					"hl": "th",
					"gl": "TH",
					"userAgent": "-",
					"clientName": "WEB",
					"clientVersion": "2.20240919.01.00",
					"originalUrl": "https://www.youtube.com/watch?v=" + id,
				}
				},
				"videoId": id,
			}, 
			{ 
				headers: headers_api_1 
			}),
			axios.post("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", 
			{
				"context": {
				"client": {
					"hl": "th",
					"gl": "TH",
					"userAgent": "-",
					"clientName": "WEB",
					"clientVersion": "2.20240919.01.00",
					"originalUrl": "https://www.youtube.com/watch?v=" + id,
				}
				},
				"videoId": id,
			}, 
			{ 
				headers: headers_api_1 
			})
			]);
			const da = response_a.data.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
			return({
				climg: da.thumbnail.thumbnails[0].url,
				cltext: da.title.runs[0].text,
				text: response_a.data.playerOverlays.playerOverlayRenderer.videoDetails.playerOverlayVideoDetailsRenderer.title.simpleText,
				idvideo: ytdl.getVideoID(id),
				img: response_b.data.videoDetails.thumbnail.thumbnails[3].url,
			});

		} else {
			console.error('เกิดข้อผิดพลาดในการดึงข้อมูล มีพบ post id');
      return 'e.';
		}
	} catch (error) {
 	  console.error(error);
    return 'e.';
	}
}


app.get('/p', (req, res) => {
  res.redirect('/pl.html');
});





app.use(express.static('./public_html'));

// เริ่มต้น server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
