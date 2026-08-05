const introScreen = document.getElementById('introScreen');
const introBtn = document.getElementById('introBtn');
const bgMusic = document.getElementById('bgMusic');

document.body.style.overflow = 'hidden';

introBtn.addEventListener('click', () => {
    bgMusic.volume = 0.6;
    bgMusic.play().catch((err) => console.warn('Não foi possível tocar a música automaticamente:', err));

    introScreen.classList.add('hidden');
    document.body.style.overflow = '';

    introScreen.addEventListener('transitionend', () => {
        introScreen.classList.add('hidden');
    }, { once: true });
});

const openBtn = document.getElementById('openOverlay');
const overlay = document.getElementById('overlay');
const askArea = document.getElementById('askArea');
const responseArea = document.getElementById('responseArea');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const backBtn = document.getElementById('backBtn');

const heartsContainer = document.getElementById('heartsContainer');
const heartColors = ['#ff8fa3', '#ff4d6d', '#ffb3c1', '#e0355a', '#ff6b81'];

function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-rise';
    heart.innerHTML = '<svg aria-label="Descurtir" class="x1lliihq x1n2onr6 xxk16z8" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Descurtir</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>';

    const left = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 140;
    const rotation = (Math.random() - 0.5) * 50;
    const duration = 2 + Math.random() * 1.6;
    const size = 14 + Math.random() * 22;

    heart.style.left = left + '%';
    heart.style.fontSize = size + 'px';
    heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    heart.style.setProperty('--drift', drift + 'px');
    heart.style.setProperty('--rot', rotation + 'deg');
    heart.style.animationDuration = duration + 's';

    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}

function heartsRain() {
    const start = Date.now();
    const totalDuration = 6000;

    function loop() {
        const elapsed = Date.now() - start;
        if (elapsed > totalDuration) return;

        const progress = elapsed / totalDuration;
        const intensity = Math.sin(Math.PI * Math.pow(progress, 0.55));

        const minInterval = 35;
        const maxInterval = 450;
        const interval = maxInterval - (maxInterval - minInterval) * intensity;

        spawnHeart();
        setTimeout(loop, interval);
    }

    loop();
}

yesBtn.addEventListener('click', () => {
    askArea.classList.add('invisible');
    responseArea.classList.add('visible');
    heartsRain();
});

openBtn.addEventListener('click', () => {
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
});

let scale = 1;

noBtn.addEventListener('click', () => {
    scale += 0.15;

    yesBtn.style.setProperty('--scale', scale);
});

backBtn.addEventListener('click', () => {
    responseArea.classList.remove('visible');
    askArea.classList.remove('invisible');
    scale = 1;
    yesBtn.style.setProperty('--scale', scale);
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
});

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el) => revealObserver.observe(el));

const lEnglishBtn = document.getElementById('lEnglish');
const lRussianBtn = document.getElementById('lRussian');

const AVAILABLE_LANGS = ['en', 'ru'];
const LOCALES_PATH = '/src/locales/';

const translations = {};
let currentLang = 'en';

async function loadTranslations() {
    const entries = await Promise.all(
        AVAILABLE_LANGS.map(async (lang) => {
            const res = await fetch(`${LOCALES_PATH}${lang}.json`);
            if (!res.ok) {
                throw new Error(`Falha ao carregar tradução: ${lang}.json`);
            }
            return [lang, await res.json()];
        })
    );

    entries.forEach(([lang, data]) => {
        translations[lang] = data;
    });
}

function applyLanguage(lang) {
    if (!translations[lang]) return;

    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const text = translations[lang][key];
        if (text !== undefined) {
            el.innerHTML = text;
        }
    });

    lEnglishBtn.classList.toggle('active', lang === 'en');
    lRussianBtn.classList.toggle('active', lang === 'ru');
}

lEnglishBtn.addEventListener('click', () => applyLanguage('en'));
lRussianBtn.addEventListener('click', () => applyLanguage('ru'));

loadTranslations()
    .then(() => applyLanguage(currentLang))
    .catch((err) => console.error(err));


const dataInicial = new Date("2026-05-17T21:21:54");

function atualizarContador() {
    const agora = new Date();
    const diferenca = agora - dataInicial;

    if (diferenca < 0) {
        document.getElementById("counter").textContent = "00:00:00:00";
        return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    document.getElementById("counter").textContent =
        `${dias}:${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

atualizarContador();
setInterval(atualizarContador, 1000);