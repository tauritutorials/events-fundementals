import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";

window.addEventListener("DOMContentLoaded", () => {
    let headerEl = document.querySelector("#progress-header");
    let progressEl = document.querySelector("#progress");
    let buttonEl: HTMLButtonElement | null = document.querySelector("#start");

    let status: "not_started" | "processing" | "paused" = "not_started";

    if (headerEl && progressEl && buttonEl) {
        buttonEl.addEventListener("click", async () => {
            headerEl.innerHTML = "Processing...";

            if (status === "not_started") {
                await invoke("start_process");
                status = "processing";
                buttonEl.innerHTML = "Pause"
            } else if(status === "processing") {
                await emit("pause");
                headerEl.innerHTML = "Paused";
                status = "paused";
                buttonEl.innerHTML = "Resume"
            } else {
                await emit("resume");
                status = "processing";
                buttonEl.innerHTML = "Pause"
            }
        });

        listen("progress", (event) => {
            progressEl.innerHTML = `${event.payload}%`;

            if (event.payload === 100) {
                headerEl.innerHTML = "Done!";
                status = "not_started";
            }
        });
    }
});
