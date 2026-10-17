use std::io::{self, Write};

fn main() {
    println!("🖥️ JungleScript Online Terminal v1.0");
    println!("Normal / PowerShell mode");
    println!("Type 'help' for available commands.");
    println!();

    let mut current_directory = String::from(r"C:\JungleScript");

    loop {
        print!("PS {}> ", current_directory);
        io::stdout().flush().unwrap();

        let mut input = String::new();

        if io::stdin().read_line(&mut input).is_err() {
            println!("❌ Could not read input.");
            continue;
        }

        let command = input.trim();

        match command {
            "" => {}

            "help" => {
                println!();
                println!("🖥️ Normal Terminal commands:");
                println!("  help       Show available commands");
                println!("  pwd        Show current directory");
                println!("  dir        List project files");
                println!("  cls        Clear terminal");
                println!("  clear      Clear terminal");
                println!("  whoami     Show current user");
                println!("  cd <path>  Change virtual directory");
                println!("  exit       Exit terminal");
                println!();
            }

            "pwd" => {
                println!("{}", current_directory);
            }

            "dir" => {
                println!();
                println!("    Directory: {}", current_directory);
                println!();
                println!("Mode        Name");
                println!("----        ----");
                println!("d----       OnlineTerminal");
                println!("d----       runtime");
                println!("d----       GameBuilder");
                println!("d----       jungleGame");
                println!("-a---       editor.html");
                println!("-a---       script.js");
                println!("-a---       style.css");
                println!();
            }

            "whoami" => {
                println!("JungleScript Online User");
            }

            "cls" | "clear" => {
                print!("\x1B[2J\x1B[1;1H");
                io::stdout().flush().unwrap();
            }

            command if command.starts_with("cd ") => {
                let path = command.trim_start_matches("cd ").trim();

                if path.is_empty() {
                    println!("❌ Please specify a directory.");
                } else {
                    current_directory = path.to_string();
                    println!("📁 Virtual directory changed to: {}", current_directory);
                }
            }

            "exit" => {
                println!("🖥️ Goodbye!");
                break;
            }

            _ => {
                println!(
                    "'{}' is not available in the Online Terminal.",
                    command
                );
                println!("Type 'help' to see supported commands.");
            }
        }
    }
}