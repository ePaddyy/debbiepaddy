const opening = document.getElementById("opening");
const animationContainer = document.getElementById("animationContainer");
const cat = document.getElementById("cat");
const birthdayPopup = document.getElementById("birthdayPopup");
const openButton = document.getElementById("openButton");
const birthdayPage = document.getElementById("birthdayPage");
const soundtrackPlayer = document.getElementById("soundtrackPlayer");
const soundtrack = document.getElementById("soundtrack");
const soundtrackToggle = document.getElementById("soundtrackToggle");
const soundtrackLabel = soundtrackToggle.querySelector(".soundtrack-label");
const soundtrackStatus = document.getElementById("soundtrackStatus");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const albumItems = [
    { type: "photo", src: "images/photos/photo_2026-11-25_13-21-07.jpg", alt: "A late-night selfie of Debs." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-21-33.jpg", alt: "Debs relaxing on a couch, wearing glasses." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-21-36.jpg", alt: "Debs sitting outdoors and looking at her phone." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-21-38.jpg", alt: "A close-up selfie of Debs in a car." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-21-53.jpg", alt: "Debs taking a mirror selfie with a green phone." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-21-55.jpg", alt: "A casual selfie of Debs." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-22-10.jpg", alt: "A mirror selfie of Debs." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-22-28.jpg", alt: "A playful close-up selfie of Debs." },
    { type: "photo", src: "images/photos/photo_2026-11-25_13-22-31.jpg", alt: "A close-up selfie of Debs." },
    { type: "video", src: "images/videos/browser-ready/F5E4F0C0-86B7-4772-9417-B58158CCA5A0.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/AB132C21-BA66-4EEF-AF58-35CC6F3A8414.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/8C412AA3-02A9-4197-B3CF-96572D7338F5.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/743E59E0-1E2F-4DE5-B26D-9C97A5B3AAEA.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/4155109E-B229-4D0A-A429-385312EBE07B.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/0EFE2E7C-746F-4A0B-ADFB-D658997FDFB2.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/0E9CCA4C-1383-4979-A1C9-8C23BDACAAD5.mp4", alt: "A video memory of Debs." },
    { type: "video", src: "images/videos/browser-ready/0028487F-38D1-4F64-87B7-AACC07B295F5.mp4", alt: "A video memory of Debs." }
];

let hasOpened = false;

function showBirthdayPopup() {
    birthdayPopup.classList.add("show");
    birthdayPopup.setAttribute("aria-hidden", "false");
    openButton.disabled = false;
    openButton.focus();
}

function startCatAnimation() {
    cat.classList.add("walking");
    const distance = Math.min(
        animationContainer.clientWidth * 0.14,
        cat.offsetWidth * 0.4
    );
    const animation = cat.animate(
        [
            { transform: "translateX(-100%)" },
            { transform: `translateX(${distance}px)` }
        ],
        {
            duration: reducedMotion ? 1 : 3200,
            easing: "linear",
            fill: "forwards"
        }
    );

    animation.addEventListener("finish", () => {
        cat.classList.remove("walking");
        cat.classList.add("waiting");
        window.setTimeout(showBirthdayPopup, 900);
    }, { once: true });
}

function openBirthdayPage() {
    if (hasOpened) {
        return;
    }

    hasOpened = true;
    opening.classList.add("leaving");
    birthdayPage.hidden = false;
    soundtrackPlayer.hidden = false;
    startSoundtrack();
    setupAlbum();

    window.setTimeout(() => {
        opening.hidden = true;
        birthdayPage.querySelector("#home h1").focus();
    }, reducedMotion ? 1 : 700);
}

function updateSoundtrackControl() {
    const isPlaying = !soundtrack.paused;
    soundtrackToggle.setAttribute("aria-pressed", String(isPlaying));
    soundtrackLabel.textContent = isPlaying ? "Pause song" : "Play song";
}

function startSoundtrack() {
    const playback = soundtrack.play();
    if (playback) {
        playback.then(() => {
            soundtrackStatus.textContent = "";
            updateSoundtrackControl();
        }).catch((error) => {
            console.error("Unable to play the birthday soundtrack.", error);
            soundtrackStatus.textContent = "The song could not start. Tap Play song to try again.";
            updateSoundtrackControl();
        });
    }
}

function setupSoundtrack() {
    soundtrack.volume = 0.7;
    soundtrackToggle.addEventListener("click", () => {
        if (soundtrack.paused) {
            startSoundtrack();
        } else {
            soundtrack.pause();
        }
    });
    soundtrack.addEventListener("play", updateSoundtrackControl);
    soundtrack.addEventListener("pause", updateSoundtrackControl);
    soundtrack.addEventListener("error", () => {
        console.error("Unable to load the birthday soundtrack.", soundtrack.error);
        soundtrackStatus.textContent = "The birthday song could not be loaded.";
        updateSoundtrackControl();
    });
}

function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
}

function setupAlbum() {
    const stage = document.getElementById("albumStage");
    const cards = Array.from(stage.querySelectorAll(".album-card"));
    const toggleButton = document.getElementById("albumToggle");
    const nextButton = document.getElementById("albumNext");
    let queue = shuffled(albumItems);
    let queueIndex = 0;
    let isVisible = false;
    let isPaused = reducedMotion;
    let isShuffling = false;
    let shuffleTimer;

    function nextItem() {
        if (queueIndex >= queue.length) {
            queue = shuffled(albumItems);
            queueIndex = 0;
        }
        return queue[queueIndex++];
    }

    function renderCard(card, item) {
        const media = card.querySelector(".album-media");
        const caption = card.querySelector("figcaption");
        const currentVideo = media.querySelector("video");
        if (currentVideo) {
            currentVideo.pause();
        }
        media.replaceChildren();
        media.classList.remove("video-unavailable");

        if (item.type === "video") {
            const video = document.createElement("video");
            video.src = item.src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = "metadata";
            video.setAttribute("aria-label", item.alt);
            video.addEventListener("error", () => {
                if (!media.contains(video)) {
                    return;
                }
                console.error(`Unable to load scrapbook video: ${item.src}`, video.error);
                media.classList.add("video-unavailable");
                const errorMessage = document.createElement("span");
                errorMessage.className = "album-media-error";
                errorMessage.setAttribute("role", "status");
                errorMessage.textContent = "This video isn't supported by this browser.";
                media.append(errorMessage);
            }, { once: true });
            media.append(video);
        } else {
            const image = document.createElement("img");
            image.src = item.src;
            image.alt = item.alt;
            image.addEventListener("error", () => {
                console.error(`Unable to load scrapbook photo: ${item.src}`);
            }, { once: true });
            media.append(image);
        }

        caption.textContent = item.type === "photo" ? "Photo memory" : "Video memory";
        card.dataset.mediaType = item.type;
    }

    function syncVideoPlayback() {
        cards.forEach((card) => {
            const video = card.querySelector("video");
            if (!video) {
                return;
            }

            const isFrontCard = Number(card.dataset.position) === 4;
            const shouldPlay = isVisible && !isPaused;
            video.controls = isFrontCard;
            if (shouldPlay) {
                const playback = video.play();
                if (playback) {
                    playback.catch((error) => {
                        console.warn("Video autoplay was blocked; use the player controls to start it.", error);
                    });
                }
            } else {
                video.pause();
            }
        });
    }

    function shuffleAlbum() {
        if (isShuffling) {
            return;
        }

        isShuffling = true;
        const positions = shuffled(cards.map((_, index) => index));
        const changingCards = shuffled(cards).slice(0, 2);
        changingCards.forEach((card) => card.classList.add("is-changing"));

        cards.forEach((card, index) => {
            const position = positions[index];
            card.dataset.position = String(position);
            card.style.setProperty("--card-angle", `${Math.round(Math.random() * 24 - 12)}deg`);
            card.style.setProperty("--card-scale", (0.86 + Math.random() * 0.18).toFixed(2));
            card.style.zIndex = String(position === 4 ? 12 : 2 + Math.floor(Math.random() * 7));
        });
        window.setTimeout(() => {
            changingCards.forEach((card) => {
                renderCard(card, nextItem());
                card.classList.remove("is-changing");
            });
            syncVideoPlayback();
        }, reducedMotion ? 0 : 850);
        window.setTimeout(() => {
            isShuffling = false;
        }, reducedMotion ? 0 : 2800);
    }

    function updateShuffleTimer() {
        window.clearInterval(shuffleTimer);
        if (!isPaused && isVisible) {
            shuffleTimer = window.setInterval(shuffleAlbum, 16000);
        }
    }

    cards.forEach((card) => renderCard(card, nextItem()));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            updateShuffleTimer();
            syncVideoPlayback();
        });
    }, { threshold: 0.2 });
    observer.observe(stage);

    toggleButton.setAttribute("aria-pressed", String(isPaused));
    toggleButton.textContent = reducedMotion ? "Auto shuffle off" : (isPaused ? "Play album" : "Pause album");
    toggleButton.disabled = reducedMotion;
    toggleButton.addEventListener("click", () => {
        isPaused = !isPaused;
        toggleButton.setAttribute("aria-pressed", String(isPaused));
        toggleButton.textContent = isPaused ? "Play album" : "Pause album";
        updateShuffleTimer();
        syncVideoPlayback();
    });
    nextButton.addEventListener("click", shuffleAlbum);
}

function setupCakeInteraction() {
    const cakeArt = document.getElementById("cakeArt");
    const wishButton = document.getElementById("wishButton");
    const cakeStatus = document.getElementById("cakeStatus");
    const wishMessage = document.getElementById("wishMessage");

    wishButton.addEventListener("click", () => {
        if (!cakeArt.classList.contains("decorated")) {
            cakeArt.classList.add("decorated");
            cakeStatus.textContent = "Your cake is ready, Debs. Take a breath and make a wish.";
            wishButton.firstChild.textContent = "Make a wish ";
            return;
        }

        cakeArt.classList.add("wished");
        wishMessage.hidden = false;
        cakeStatus.textContent = "Wish sent. Your candles are out!";
        wishButton.disabled = true;
        wishButton.textContent = "Wish sent";
    });
}

function setupScrollReveals() {
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
}

openButton.addEventListener("click", openBirthdayPage);
setupSoundtrack();
setupCakeInteraction();
setupScrollReveals();

window.addEventListener("load", () => {
    window.setTimeout(startCatAnimation, 500);
}, { once: true });
