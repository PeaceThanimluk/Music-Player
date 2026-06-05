
const track = [
    {
        title: "สมดุลรัก(Balance)",
        artist: "SEA.",
        src: "/song/Balance.mp3",
        img: "/img/Balance.png",
    },

    {
        title: "Rain Zone",
        artist: "Maiyarap",
        src: "/song/Rain-Zone.mp3",
        img: "/img/Rain-Zone.png",
    },

    {
        title: "รักให้เธอได้รู้(Proof.)",
        artist: "PUN",
        src: "/song/Proof.mp3",
        img: "/img/Proof.png"
    },

    {
        title: "ที่สุดเลย (ร่วมกับ Saran)",
        artist: "RIFLE",
        src: "/song/TeeSudLei.mp3",
        img: "/img/TeeSudLei.png"
    },

    {
        title: "นิทานในฝัน 2024",
        artist: "PUN",
        src: "/song/NitanNaiFan.mp3",
        img: "/img/NitanNaiFan.png"
    },

    {
        title: "Hurry Up! (ร่วมกับ 7Vibes)",
        artist: "JayQ",
        src: "/song/HurryUp.mp3",
        img: "/img/HurryUp.png"
    },

    {
        title: "i love you a latte",
        artist: "the ge",
        src: "/song/ILoveYouALatte.mp3",
        img: "/img/ILoveYouALatte.png"
    },

    {
        title: "อ๊ะป่าว?",
        artist: "The 38 Years Ago",
        src: "/song/Apao.mp3",
        img: "/img/Apao.png"
    },

    {
        title: "Sex and Float",
        artist: "Percy",
        src: "/song/SexAndFloat.mp3",
        img: "/img/SexAndFloat.png"
    },

    {
        title: "Stay Around Me (ร่วมกับ 2Ectasy)",
        artist: "mind",
        src: "/song/StayAroundMe.mp3",
        img: "/img/StayAroundMe.png"
    },

    {
        title: "Part Time (ร่วมกับ APE FREDDA)",
        artist: "Cxpy",
        src: "/song/PartTime.mp3",
        img: "/img/PartTime.png"
    }

];

/*=====================STATE=====================*/

let current = 0;
let isPlaying = false;
let elapsed = 0;
let shuffle = false;
let repeat = false;
let timer = null;

/*=====================ELEMENTS=====================*/

const musicPlayer = document.getElementById("music-player");
const imgContainer = document.getElementById("img-container");
const albumArt = document.getElementById("album-art");
const titleTrack = document.getElementById("title");
const artistTrack = document.getElementById("artist");
const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("current-time");
const durationTime = document.getElementById("duration-time");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const bgColor = document.getElementById("bg");

const trackAudio = new Audio;

const colorThief = new ColorThief;

/*=====================Minute calculate function=====================*/

function fmt(second) {
    const m = Math.floor(second / 60);
    const sec = Math.floor(second % 60);

    if (sec < 10) {
        return m + ':0' + sec;
    }

    return m + ':' + sec;
}

/*=====================BACKGROUND COLOR UPDATE=====================*/

function updateBackground() {
    if (!albumArt) return;

    const colorOne = colorThief.getColor(albumArt);
    const [r, g, b] = colorOne;

    const darkColor = [
        Math.floor(r * 0.35),
        Math.floor(g * 0.35),
        Math.floor(b * 0.35)
    ];

    musicPlayer.style.background = `
    linear-gradient(
        180deg,
        rgb(${darkColor.join(',')}) 0%,
        rgb(15,15,15) 100%
    )
    `;

    document.body.style.setProperty(
        '--dynamic-bg',
        `
        linear-gradient(
            180deg,
            rgb(${r},${g},${b}) 0%,
            rgb(${Math.floor(r * 0.5)},${Math.floor(g * 0.5)},${Math.floor(b * 0.5)}) 40%,
            rgb(5,5,5) 100%
        )
        `
    );
    
}

/*=====================Load Track=====================*/

function loadTrack(idx) {
    current = idx;
    const t = track[idx];

    titleTrack.textContent = t.title;
    artistTrack.textContent = t.artist;

    //Image

    if (t.img) {

        albumArt.onload = () => {
            updateBackground();
        }

        albumArt.src = t.img;
    }
    else {
        albumArt.src = '';
    }

    trackAudio.src = t.src;
    trackAudio.load();

    //reset ui
    progressBar.value = 0;
    currentTime.textContent = '0:00';
    durationTime.textContent = '0:00';
}

/*=====================PLAY=====================*/

function play() {
    isPlaying = true;
    trackAudio.play();
    playBtn.innerHTML = '<i class="fas fa-pause-circle fa-5x"></i>';
    imgContainer.classList.add('playing');
}

/*=====================PAUSE=====================*/

function pause() {
    isPlaying = false;
    trackAudio.pause();
    playBtn.innerHTML = '<i class="fas fa-play-circle fa-5x"></i>';
    imgContainer.classList.remove('playing');
}

/*=====================NEXT=====================*/

function nextTrack() {
    let idx;

    if (shuffle) { //ถ้ามี เปิด random 
        do {
            idx = Math.floor(Math.random() * track.length); //ลองสุ่มดูก่อน1ครั้ง
        } while (idx === current && track.length > 1); //จะสุ่มซ้ำเรื่อยๆจนกว่าจะได้เพลงใหม่และไม่ซ้ำกับเพลงเดิม และจะไม่ไปเพลงอื่นต่อถ้าเพลงมีแค่1
    }
    else { //ถ้าปิดrandom
        idx = (current + 1) % track.length; //คำนวณให้ถ้าถึงเพลงสุดท้ายจะวนกลับไปเพลงแรก
    }

    loadTrack(idx);
    if (isPlaying) play();
}

/*=====================PREVIOUS=====================*/
function prevTrack() {
    //ถ้าเล่นเพลงมาเกิน3วิ จะกลับไปที่วิเริ่มต้น
    if (trackAudio.currentTime > 3) {
        trackAudio.currentTime = 0;
        return; //หยุดการทำงานของ function นี้
    }
    loadTrack((current - 1 + track.length) % track.length);
    if (isPlaying) play();
}

/*=====================AUDIO EVENTS=====================*/

//อัพเดท progress bar และเวลาตาม audio จริง
trackAudio.addEventListener('timeupdate', () => {
    if (!trackAudio.duration) return;
    const pct = (trackAudio.currentTime / trackAudio.duration) * 100; //คำนวณเปอร์เซ็นความยาวเพลง
    progressBar.value = pct;
    currentTime.textContent = fmt(trackAudio.currentTime);
})

//เมื่อเว็บโหลดเพลงเสร็จ
trackAudio.addEventListener(`loadedmetadata`, () => { 
    durationTime.textContent = fmt(trackAudio.duration); //ปรับduration time text เป็นเวลา
})

//เมื่อเพลงจบ
trackAudio.addEventListener(`ended`, () => {
    if(repeat) {
        trackAudio.currentTime = 0;
        trackAudio.play();
    }
    else {
        nextTrack();
    }
})

/*=====================PROGRESS BAR INPUT=====================*/
progressBar.addEventListener(`input`, () => {
    if (!trackAudio.duration) return;
    trackAudio.currentTime = (progressBar.value / 100) * trackAudio.duration;
})


/*=====================BUTTON EVENTS =====================*/

playBtn.addEventListener(`click`, () => isPlaying ? pause() : play());
nextBtn.addEventListener(`click`, nextTrack);
prevBtn.addEventListener(`click`, prevTrack);

shuffleBtn.addEventListener(`click`, () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active', shuffle);
    /*
    if (shuffle) {
    shuffleBtn.classList.add('active');
    } else {
    shuffleBtn.classList.remove('active');
    }
    */
    shuffleBtn.classList.remove('pop');
    void shuffleBtn.offsetWidth; // reflow
    shuffleBtn.classList.add('pop');
})

repeatBtn.addEventListener(`click`, () => {
    repeat = !repeat;
    repeatBtn.classList.toggle('active', repeat);

    repeatBtn.classList.remove('pop');
    void repeatBtn.offsetWidth; // reflow
    repeatBtn.classList.add('pop');
})


/*=====================INIT=====================*/
loadTrack(0);