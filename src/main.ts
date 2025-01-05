import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

window.addEventListener("DOMContentLoaded", () => {
    let headerEl = document.querySelector("#progress-header");
    let progressEl = document.querySelector("#progress");
    let buttonEl: HTMLButtonElement|null = document.querySelector("#start");

    if (headerEl && progressEl && buttonEl) {
        buttonEl.addEventListener("click", async () => {
            await invoke("start_process");

            headerEl.innerHTML = "Processing...";
            buttonEl.disabled = true;
        });

        listen("progress", (event) => {
            progressEl.innerHTML = `${event.payload}%`;

            if (event.payload === 100) {
                headerEl.innerHTML = "Done!";
                buttonEl.disabled = false;
            }
        });
    }
});
