let stages = [];
let currentStageIndex = 0;
let interval;
let totalTime = 0;
let isPaused = false;

document.getElementById("add-stage").addEventListener("click", addStage);
document.getElementById("start-tournament").addEventListener("click", startTournament);
document.getElementById("pause-resume-btn").addEventListener("click", togglePauseResume);
document.getElementById("end-tournament-btn").addEventListener("click", endTournamentEarly);

// Mostrar la primera etapa predeterminada al cargar la página
window.onload = () => addStage();

function addStage() {
    const stageContainer = document.getElementById("stages-container");
    const stageIndex = stages.length + 1;

    const stageDiv = document.createElement("div");
    stageDiv.classList.add("stage-input", "input-group", "mb-3");
    stageDiv.innerHTML = `
        <span class="input-group-text">Etapa ${stageIndex}:</span>
        <input type="number" class="form-control" placeholder="Little Blind" min="0" required>
        <input type="number" class="form-control" placeholder="Big Blind" min="0" required>
        <input type="number" class="form-control" placeholder="Duración (min)" min="1" required>
    `;
    stageContainer.appendChild(stageDiv);

    stages.push({ littleBlind: 0, bigBlind: 0, duration: 0 });
}

function startTournament() {
    const inputs = document.querySelectorAll("#stages-container .stage-input");
    stages = Array.from(inputs).map((stageDiv) => {
        const [lbInput, bbInput, durationInput] = stageDiv.querySelectorAll("input");
        return {
            littleBlind: parseInt(lbInput.value),
            bigBlind: parseInt(bbInput.value),
            duration: parseInt(durationInput.value)
        };
    });

    totalTime = stages.reduce((total, stage) => total + stage.duration, 0);
    document.getElementById("total-time").textContent = `Tiempo total: ${totalTime} minutos`;

    if (stages.length > 0) {
        document.getElementById("setup-container").style.display = "none";
        document.getElementById("tournament-container").style.display = "block";
        updateTournamentSummary();
        startStage();
    }
}

function startStage() {
    const currentStage = stages[currentStageIndex];
    if (!currentStage) return endTournament();

    document.getElementById("current-stage").textContent = currentStageIndex + 1;
    document.getElementById("little-blind").textContent = currentStage.littleBlind;
    document.getElementById("big-blind").textContent = currentStage.bigBlind;

    let timeLeft = currentStage.duration * 60;
    displayTime(timeLeft);
    updateTournamentSummary();

    interval = setInterval(() => {
        if (!isPaused) {
            timeLeft -= 1;
            displayTime(timeLeft);
        }

        if (timeLeft <= 0) {
            clearInterval(interval);
            currentStageIndex += 1;
            startStage();
        }
    }, 1000);
}

function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function togglePauseResume() {
    isPaused = !isPaused;
    document.getElementById("pause-resume-btn").textContent = isPaused ? "Reanudar" : "Pausar";
}

function endTournamentEarly() {
    clearInterval(interval);
    document.getElementById("tournament-container").style.display = "none";
    document.getElementById("setup-container").style.display = "block";
    resetTournament();
}

function endTournament() {
    clearInterval(interval);
    document.getElementById("timer").textContent = "Torneo Finalizado";
}

function resetTournament() {
    currentStageIndex = 0;
    isPaused = false;
    stages = [];
    document.getElementById("stages-container").innerHTML = "";
    addStage(); // Mostrar etapa inicial predeterminada
    document.getElementById("total-time").textContent = "Tiempo total: 0 minutos";
}

// Actualizar resumen del torneo en progreso
function updateTournamentSummary() {
    const summaryList = document.getElementById("summary-list");
    summaryList.innerHTML = stages.map((stage, index) => {
        const isCurrent = index === currentStageIndex;
        return `
            <li class="${isCurrent ? 'fw-bold' : ''}">
                ${index + 1} - ${stage.littleBlind}/${stage.bigBlind} - ${stage.duration} min${isCurrent ? " -> Etapa actual" : ""}
            </li>
        `;
    }).join('');
}
