fn main() {
    tauri_build::build();

    #[cfg(target_os = "macos")]
    {
        cc::Build::new()
            .file("cc/TitleBarHelper.m")
            .compile("title");

        // 代码改动时重新编译
        println!("cargo:rerun-if-changed=cc");
    }
}
