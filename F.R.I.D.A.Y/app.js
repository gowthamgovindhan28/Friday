// elements

const on =document.querySelector('#on');
const off =document.querySelector('#off');
const speak =document.querySelector('#speak');
const time =document.querySelector('#time');
const batt =document.querySelector('#battery');
const internet =document.querySelector('#internet');
const commands=document.querySelector('.commands');
const msgs=document.querySelector('.messages');
const a= document.querySelector('.au');
const jarvis_intro = document.querySelector("#j_intro");
const machine = document.querySelector(".machine");
const vintro = document.querySelector("#vi");



// rec stop problem
let stopingR = false;





// start jarvis with btn
let stb=document.querySelector("#start_jarvis_btn");
stb.addEventListener("click", () => {
  recognition.start();
  stb.style.display='none'
})

let sb=document.querySelector("#stop_jarvis_btn");
sb.addEventListener("click", () => {
  stopingR = true;
  sb.style.display='none';
  stb.style.display='flex';
  recognition.stop();
})




// fridayComs

let fridayComs=[];

fridayComs.push('hey or Hello');
fridayComs.push("what are your Commands");
fridayComs.push("tell about yourself");
fridayComs.push("play intro");
fridayComs.push("what's my bio");
fridayComs.push("what's my name");
fridayComs.push("check system status (online or offline)");
fridayComs.push("what's the charging status");
fridayComs.push("what's the current charge");
fridayComs.push("close this -to close opened popups");
fridayComs.push("change my information -information regarding your accounts and you");
fridayComs.push("whats the weather or temperature");
fridayComs.push("full weather report");
fridayComs.push("are you there -to check friday presence");
fridayComs.push("shut down - stop voice recognition");
fridayComs.push("open google");
fridayComs.push('search for "your keywords" - to search on google ');
fridayComs.push("open youtube");
fridayComs.push('play video "your keywords" - to search on youtube ');
fridayComs.push('play Music "your keywords" - to search on spotify');
fridayComs.push('play song "1 or 2 or 3 or skyfall or leo" - to play song ');
fridayComs.push("open instagram");
fridayComs.push("open open my instagram profile");
fridayComs.push("open my twitter profile");
fridayComs.push("open facebook");
fridayComs.push("date");
fridayComs.push("time");
fridayComs.push("open calculator");
fridayComs.push("open calendar");
fridayComs.push("open github");
fridayComs.push("open my github profile");

// YT window
let ytbWindow;


// chat box

function createMsg(who,msg){
    let newmsg=document.createElement('p');
    newmsg.innerText=msg;
    newmsg.setAttribute("class",who)
    msgs.appendChild(newmsg);
    let br=document.createElement('br');
    msgs.appendChild(br);

}

// show a warn to check for all the commands
console.warn('*to check for the commands speak "what are your commands"');

// this is what friday tells about weather
let weatherStatement = "";
let charge,chargeStatus, connectivity, currentTime
chargeStatus = "unplugged";

// weather setup

function weather(location) {

    const weatherCont=document.querySelector('.temp').querySelectorAll('*');
    
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=549d4240491fd7648014d668df71c297`;
   
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onload = function () { 
        if (this.status === 200) {
            let data = JSON.parse(this.responseText);
            weatherCont[0].textContent = `Location : ${data.name}`;
            weatherCont[1].textContent = `Country : ${data.sys.country}`;
            weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
            weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
            weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherCont[5].textContent = `Original Temperature : ${ktc(data.main.temp)} 'C`;
            weatherCont[6].textContent = `But it feels like ${ktc(data.main.feels_like)}`;
            weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
            weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
            weatherStatement=`sir the weather in ${data.name} is ${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)}`;

        } else {
            weatherCont[0].textContent="Sorry sir weather info not Found";
        }
    }

    xhr.send();
}


function ktc(k) {
    k = (k - 273.15);
    return k.toFixed(2);
}

// db
const userdata = localStorage.getItem("jarvis_setup");

// time setup

let date=new Date()
let hours=date.getHours()
let min =date.getMinutes()
let secs=date.getSeconds()

// autoJarvis

function autoJarvis(){
    setTimeout(() => {
         recognition.start();
    }, 1000);
}

// jarvis setup bar

if(localStorage.getItem('jarvis_setup') !==null){
    const userdata = localStorage.getItem("jarvis_setup");
    const loc = JSON.parse(userdata).location;
    weather(loc);
}


// jarvis information setup



const setup= document.querySelector('.jarvis_setup');

setup.style.display="none" 
if(localStorage.getItem("jarvis_setup")===null){
     
//  setup.style.display="block";
 setup.style.display="flex";
 setup.querySelector("button").addEventListener("click",userInfo);

}

// user info
function userInfo(){
     let setupInfo={
        name:setup.querySelectorAll("input")[0].value,
        bio:setup.querySelectorAll("input")[1].value,
        location:setup.querySelectorAll("input")[2].value,
        instagram:setup.querySelectorAll("input")[3].value,
        twitter:setup.querySelectorAll("input")[4].value,
        github:setup.querySelectorAll("input")[5].value,
          
     }

     let testArr=[];
     setup.querySelectorAll("input").forEach(
        (e)=>{
            testArr.push(e.value)
        }
     )

     if(testArr.includes('')){
        readout("sir enter your complete information ")
     }
      else{
        localStorage.clear();
        localStorage.setItem('jarvis_setup',JSON.stringify(setupInfo));
        setup.style.display="none";
        const jarvisSetup = localStorage.getItem("jarvis_setup");
        const loc = JSON.parse(jarvisSetup).location;
        weather(loc);
        
      }

}




// speech recognition setup

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;


// sr on
recognition.onstart =function (){

    console.log('Speech recognition service started');
    document.querySelector("#stop_jarvis_btn").style.display = "flex"
}


// arr of windows

let windowsB =[];

// sr result

recognition.onresult=function (event){

    let current =event.resultIndex;
    let transcript =event.results[current][0].transcript;
    transcript=transcript.toLowerCase();
    console.log(`my Words: ${transcript}`);

    createMsg("usermsg",transcript);



    // command script


     if(transcript.includes('hey') || transcript.includes('hello')){
        readout("hi sir, how may i help you ?");
    }
     if(transcript.includes('play intro')){
        vintro.play();
        readout("Friday initializing...");
    }
     if(transcript.includes('stop')){
        vintro.pause();
        readout("Friday stoped...");
    }

    // shutdown
      
    if(transcript.includes('shutdown') || transcript.includes('shut down')){
        recognition.stop();
        readout("Initiating, shutdown process,Goodbye ,Sir");
        stopingR = true;
        stb.style.display='flex';
        
  
    }

    if (transcript.includes('are you there')) {
        const responses = [
            "Yes, it’s Friday here! Ready to kick off the weekend vibes!",
            "Absolutely! It’s me, Friday! What can I help you with today?",
            "You bet! Friday reporting for duty. What’s on your mind?",
            "I’m right here! Happy to assist you. It’s a great day to be Friday!",
            "Yes, indeed! It’s Friday, and I’m here to make your day brighter!",
            "Of course! You can’t get rid of me that easily. Friday is always here!",
            "Yes, I’m here! Let’s make the most of this fantastic Friday together!"
        ];
    
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        readout(randomResponse);
    }


        // some casual commands
     if (transcript.includes("what's the current charge")) {
        readout(`the current charge is ${charge} sir`);
      }
      if (transcript.includes("what's the charging status")) {
        readout(`the current charging status is ${chargeStatus} sir`);
      }
      
      if (transcript.includes("check system status")) {
        readout(`you are ${connectivity} sir`);
      }
    

    // open cmds
     if(transcript.includes('what are your commands')){
        readout("Sir I Follow the following commands");
        // console.log('commands')
        if(window.innerWidth <= 400 ){
            window.resizeTo(screen.width,screen.height)
          }

        commands.style.display='block';
    }

    // close cmds
    if(transcript.includes('close this')){
        readout("closed Sir");
        // console.log('commands')
        commands.style.display='none';
        setup.style.display='none';
    }


    if (transcript.includes("what's my name")) {
      console.log("name")
        readout(`Sir, I know that you are ${JSON.parse(userdata).name}`);
      }
      if (transcript.includes("what's my bio")) {
        readout(`Sir, I know that you are ${JSON.parse(userdata).bio}`);
      }


      // friday bio
    if (transcript.includes("tell about yourself")) {
        readout(
         "Hi, I’m Friday, a browser-based voice assistant, created using JavaScript, by a developer named Gowtham G. I’m designed to handle any task, that can be accomplished within a browser."
        );
      }
  

    // close all tabs
    // if (transcript.includes("close all tabs")) {
    //     readout("closing all tabs sir")
    //     windowsB.forEach((e) => {
    //       e.close()
    //     })
    
    //   }

    // change my information

    if(transcript.includes('change my information')){
        readout("opening your information Sir");
        localStorage.clear();
        weatherCont=[];
        

        if(window.innerWidth <= 400 ){
            window.resizeTo(screen.width,screen.height)
          }
          setup.style.display = "flex";
          setup.querySelector("button").addEventListener("click", userInfo);
        
    }

    // weather report
    if (
        transcript.includes("what's the temperature") ||
        transcript.includes("what's the weather")
      ) {
        readout(weatherStatement);
      }
    
      if (transcript.includes("full weather report")) {
        readout("opening the weather report sir");
        let a = window.open(
          `https://www.google.com/search?q=weather+in+${
            JSON.parse(localStorage.getItem("jarvis_setup")).location
          }`
        );
        windowsB.push(a)
      }
    




     if(transcript.includes('open google')){
       let a = window.open("https://google.com","_blank");
       windowsB.push(a);
        
       const googlePhrases = [
        "Accessing Google",
        "Launching Google",
        "Starting Google",
        "Navigating to Google",
        "Visiting Google"
      ];
      const randomPhrase = googlePhrases[Math.floor(Math.random() * googlePhrases.length)];      
       readout(randomPhrase);
    }

    // search for Google

     if(transcript.includes('search for')){
        
        input=transcript.split("");
        input.splice(0,11);
        input.pop();
        input=input.join("")
        readout("Finding For"+input)
        
        input=input.split(" ").join("+");
       let a = window.open(`https://www.google.co.in/search?q=${input}`);
        windowsB.push(a);
    }
    
    // play video in youtube

    if(transcript.includes('play video')){

        input=transcript.split("");
        input.splice(0,11);
        input.pop();
        input=input.join("")

        const phrases = [
          "Playing video",
          "Starting video",
          "Launching video",
          "Viewing video",
          "Watching video",
          "Streaming video"
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        
        readout(randomPhrase+input)
        
        input=input.split(" ").join("+");
       
        console.log(input);
       let a = window.open(`https://www.youtube.com/results?search_query=${input}`)
        windowsB.push(a);

    }

    // play music on spotify
     
    if(transcript.includes('play music')){

        input=transcript.split("");
        input.splice(0,11);
        input.pop();
        input=input.join("");
        readout("playing Music"+input)
        
    
       
        console.log(input);
        window.open(`https://open.spotify.com/search/${input}`)


    }

        // playing song 


    if(transcript.includes('play song')){


        readout("playing song Sir...")
        console.log("playing song..")
        

        input=transcript.split("");
        input.splice(0,10);
        input.pop();
        input=input.join("");
        console.log(input);

        if(input.includes('leo')){
        
        window.open("https://music.youtube.com/watch?v=8VEqzGViPrc");
    }

            if(input.includes('skyfall')){
        
        window.open("https://music.youtube.com/watch?v=LJzp_mDxaT0&list=RDAMVMLJzp_mDxaT0");
     }

            if(input.includes('1')){
                    
                window.open("https://music.youtube.com/watch?v=qD53-RZpTOc");
            }
            if(input.includes('2')){
                
                window.open("https://music.youtube.com/watch?v=Rr6jwLeXN7I");
            }
            if(input.includes('3')){
                
                window.open("https://music.youtube.com/watch?v=YOP2BRYuLPQ");
            }

    }

     if(transcript.includes('open youtube')){
        window.open("https://youtube.com","_blank");
        readout("Launching youtube..");
    }
     if(transcript.includes('open facebook')){
        window.open("https://facebook.com","_blank");
        readout("opening facebook..");
    }


     if(transcript.includes('time')) {
        const time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"})
        const finalText = time;
        readout(finalText);
    }

     if(transcript.includes('date')) {
        const date = new Date().toLocaleString(undefined, {month: "short", day: "numeric"})
        const finalText = date;
        readout(finalText);
    }

     if(transcript.includes('calculator')) {
        window.open('Calculator:///')
        const finalText = "Opening Calculator";
        readout(finalText);
    }

    // user info section

    if(transcript.includes('open github')){
        readout("opening github sir")
        // window.open("https://github.com/")
        window.open(`https://github.com/${JSON.parse(userdata).github}`)
    }
   
       
  

    if (transcript.includes("open instagram")) {
        if (JSON.parse(userdata).instagram) {
          readout("opening your instagram profile");
          let a =window.open(
            `https://www.instagram.com/${JSON.parse(userdata).instagram}/`
          );
          windowsB.push(a)
        } else {
          readout("sir i didn't found your instagram information");
        }
      }
      // twitter
      if (transcript.includes("open twitter")) {
        readout("opening your twitter profile");
        let a=window.open(`https://twitter.com/${JSON.parse(userdata).twitter}`);
        windowsB.push(a)
      }

       // calendar
    if (transcript.includes("open calendar")) {
        readout("opening calendar");
        let a = window.open("https://calendar.google.com/");
        windowsB.push(a)
      }


    // user info open

   /*  if(transcript.includes('open user info')){
        readout("opening user info sir");
        setup.style.display="block";
    } */

        
   

}



// sr stop
recognition.onend =function(){
    
    console.log('Speech recognition service ended');
    if (stopingR === false) {
      setTimeout(() => {
        recognition.start();
        
      }, 500);
    } else if (stopingR === true) {
      recognition.stop();
      document.querySelector("#stop_jarvis_btn").style.display = "none"
    }
}

// SR loop

// recognition.continuous=true;

// sr start and stop

on.addEventListener("click", ()=>{
    recognition.start();
})
off.addEventListener("click", ()=>{
    recognition.stop();
})


// friday speech

function readout(msg){

    const speech= new SpeechSynthesisUtterance();
    // different voices 
    const allVoices=speechSynthesis.getVoices();
    speech.text=msg;
    speech.voice=allVoices[4];
    speech.volume=1;
    window.speechSynthesis.speak(speech);
    console.log("speaking...")
    createMsg('jmsg',msg);

    // scroll effect

    let msd=document.querySelector('.messages');
    msd.scrollTo(0,2800);


}


// small jarvis
const smallJarvis = document.querySelector("#small_jarvis")



smallJarvis.addEventListener("click", () => {
  
window.open(`${window.location.href}`,"newWindow","menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0")
  
  window.close();
})



document.querySelector("#jarvis_start").addEventListener("click", () => {
  recognition.start()
  readout("i am Friday version 2 point o")
})




// onload voice change





window.onload =function(){

    // onstart up

    const a= document.querySelector('.au');
    a.play().catch((error) => {

      setTimeout(() => {
        readout("Ready to Go Sir");
        // autoJarvis();
        if(localStorage.getItem('jarvis_setup')==null){
            readout('sir, Kindly Fill Out the Form');
        }
    },200);
        console.log('Autoplay was prevented. Browser policies require user interaction.');
    });

     a.addEventListener('ended',()=>{

        setTimeout(() => {
            readout("Ready to Go Sir");
            // autoJarvis();
            if(localStorage.getItem('jarvis_setup')==null){
                readout('sir, Kindly Fill Out the Form');
            }
        },200);
   })
    

    // friday cmd adding

    fridayComs.forEach((e)=>{
        document.querySelector('.commands').innerHTML +=`<p>#${e}</p> <br/>`
    })

// time
time.textContent=`${hours}:${min}:${secs}`;

setInterval(() => {
    
    let date=new Date()
    let hours=date.getHours()
    let min =date.getMinutes()
    let secs=date.getSeconds()
    if(secs<10){
        secs='0'+secs;
    }
    if(min<10){
        min='0'+min;
    }
    time.textContent=`${hours}:${min}:${secs}`;
  
}, 1000);


// battery setup
let batteryPromise=navigator.getBattery()
batteryPromise.then(batteryCallback)
// battery callback
function batteryCallback(batteryObject){
    printBatteryStatus(batteryObject)
    setInterval(() => {
        printBatteryStatus(batteryObject)
    },5000);


}
function printBatteryStatus(batteryObject){

    // batt.textContent=`${(batteryObject.level)*100}%`;
    if(batteryObject.charging === true){
        document.querySelector('.battery').style.width="200px";
        batt.textContent=`${Math.round((batteryObject.level)*100)}% Charging..`;
        chargeStatus = "plugged in"
        charge=`${Math.round((batteryObject.level)*100)}% Charging`;

    }
    if(batteryObject.charging === false){
        document.querySelector('.battery').style.width="";
        batt.textContent=`${Math.round((batteryObject.level)*100)}%`;
        charge=`${Math.round((batteryObject.level)*100)}%`;

    }
}


// internet setup

if(navigator.onLine){
    document.querySelector("#internet").textContent = "online"
    connectivity = "online"
  } else {
    document.querySelector("#internet").textContent = "offline"
    connectivity = "offline"
  }

setInterval(() => {
  if(navigator.onLine){
    document.querySelector("#internet").textContent = "online"
    connectivity = "online"
  } else {
    document.querySelector("#internet").textContent = "offline"
    connectivity = "offline"
  }
}, 60000);

// voice change
    readout(" ")
}




// ex

speak.addEventListener('click',()=>{
    readout("Friday initializing...")
})


