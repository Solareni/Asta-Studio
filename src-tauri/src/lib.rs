use std::ffi::c_void;

use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};
use tauri::{async_runtime::Mutex, AppHandle, Emitter, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
extern "C" {
    fn init_title(ns_window: *mut c_void);
}

enum RenderCommand {
    FromNative(i32),
}

static RENDER_QUEUE: Lazy<(flume::Sender<RenderCommand>, flume::Receiver<RenderCommand>)> =
    Lazy::new(|| {
        let (sender, receiver) = flume::bounded(1);
        (sender, receiver)
    });

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            {
                let app = app.handle().clone();
                let win_builder = WebviewWindowBuilder::new(&app, "main", WebviewUrl::default())
                    .title("Transparent Titlebar Window")
                    .min_inner_size(800.0, 600.0)
                    .inner_size(800.0, 600.0);

                // set transparent title bar only when building for macOS
                #[cfg(target_os = "macos")]
                let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

                let window = win_builder.build().unwrap();
                #[cfg(target_os = "macos")]
                unsafe {
                    let ns_window = window.ns_window().unwrap();
                    init_title(ns_window);
                }
            }

            let app = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                while let Ok(command) = RENDER_QUEUE.1.recv_async().await {
                    match command {
                        RenderCommand::FromNative(tag) => {
                            if tag == 0 {
                                emit_event(&Event::SidebarControl, &app);
                            }

                        },
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[no_mangle]
unsafe extern "C" fn do_something(tag: i32) {
    println!("do something: {}", tag);
    RENDER_QUEUE.0.send(RenderCommand::FromNative(tag)).unwrap();
}



fn emit_event<R: tauri::Runtime>(event: &Event, manager: &AppHandle<R>) {
    let message = serde_json::to_string(event).unwrap();
    manager.emit("emit_event", message).unwrap();
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "event")]
enum Event {
    #[serde(rename = "sidebar_control")]
    SidebarControl
}