use std::io::{self, Write};

fn main() {
    println!("🌴 JungleScript Online Terminal v1.0");
    println!("Jungle mode");
    println!("Type 'help' for commands.");
    println!();

    loop {
        print!("JLS> ");
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
                println!("🌴 JungleScript commands:");
                println!("  help              Show this help");
                println!("  version           Show JungleScript version");
                println!("  modules           Show available modules");
                println!("  assets            Show project assets");
                println!("  clear             Clear the terminal");
                println!("  exit              Exit Jungle Terminal");
                println!("  run <file>        Run a JungleScript file");
                println!("  owner             Show the owner of this project");
                println!("  my youtube        Show the YouTube channel of the owner");
                
            }

            "version" => {
                println!("JungleScript v1.0");
            }

            "modules" => {
                println!("📦 Available modules:");
                println!("  JungleWeb");
                println!("  JungleGame");
                println!("  JungleOS");
            }

            "assets" => {
                println!("📁 Project assets:");
                println!("  Assets are managed by the JungleScript Online IDE.");
            }

            "clear" => {
                print!("\x1B[2J\x1B[1;1H");
                io::stdout().flush().unwrap();
            }

            "exit" => {
                println!("🌴 Goodbye!");
                break;
            }

            command if command.starts_with("run ") => {
                let file = command.trim_start_matches("run ").trim();

                if file.is_empty() {
                    println!("❌ Please specify a JungleScript file.");
                } else {
                    println!("▶ Running JungleScript file: {}", file);
                    println!("⚠️ File execution will be connected to the JungleScript runtime later.");
                }
            }

            _ => {
                println!("❌ Unknown JungleScript command: {}", command);
                println!("Type 'help' to see available commands.");
            }
        }
    }
}