use std::{thread::sleep, time::Duration};
use tauri::{AppHandle, Emitter};

#[tauri::command]
fn start_process(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        for i in 0..=100 {
            app.emit("progress", i).ok();

            sleep(Duration::from_millis(50));
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![start_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
