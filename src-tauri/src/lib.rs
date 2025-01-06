use std::time::Duration;
use tauri::{AppHandle, Emitter, Listener};
use tokio::time::sleep;

use std::sync::atomic::{AtomicBool, Ordering};

#[tauri::command]
fn start_process(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        static IS_PAUSED: AtomicBool = AtomicBool::new(false);

        app.listen("pause", |_| {
            IS_PAUSED.store(true, Ordering::Relaxed);
        });

        app.listen("resume", |_| {
            IS_PAUSED.store(false, Ordering::Relaxed);
        });

        for i in 0..=100 {
            while IS_PAUSED.load(Ordering::Relaxed) {
                sleep(Duration::from_millis(10)).await;
            }

            app.emit("progress", i).ok();

            sleep(Duration::from_millis(50)).await;
        }
    });
}

#[tauri::command]
fn send_message(app: AppHandle, message: &str) {
    app.emit_to("window_2","message",  message).ok();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![start_process, send_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
