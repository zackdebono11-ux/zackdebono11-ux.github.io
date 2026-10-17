
use std::env;
use std::io::{self, Write};
use std::path::PathBuf;
use std::process::{Command, ExitStatus};

const JUNGLESCRIPT_VERSION: &str = "1.0";

fn main() {
    let_= crossterm::terminal::enable_raw_mode();
    println!("🌴 JungleScript Terminal v{}", JUNGLESCRIPT_VERSION);
    println!("PowerShell integration enabled.");
    println!("Type 'help' for commands or 'exit' to quit.");
    println!();

    let mut current_dir = match env::current_dir() {
        Ok(path) => path,
        Err(error) => {
            eprintln!("Could not get current directory: {}", error);
            return;
        }
    };

    loop {
        print!("JLS> ");
        if io::stdout().flush().is_err() {
            eprintln!("Could not display terminal prompt.");
            break;
        }

        let mut input = String::new();

        match io::stdin().read_line(&mut input) {
            Ok(0) => {
                println!("\nGoodbye! 🌴");
                break;
            }
            Ok(_) => {}
            Err(error) => {
                eprintln!("Input error: {}", error);
                continue;
            }
        }

        let command = input.trim();

        if command.is_empty() {
            continue;
        }

        // JungleScript built-in commands
        match command.to_lowercase().as_str() {
            "help" => {
                show_help();
                continue;
            }

            "version" => {
                println!("JungleScript v{}", JUNGLESCRIPT_VERSION);
                continue;
            }

            "clear" | "cls" => {
                print!("\x1B[2J\x1B[H");
                let _ = io::stdout().flush();
                continue;
            }

            "exit" | "quit" => {
                println!("Goodbye! 🌴");
                break;
            }

            "owner" => {
                println!(
                    "Of course, the owner of this project is \
                     @zackdebono11-ux. You can reach out to him \
                     for any queries or contributions. 🌴"
                );
                continue;
            }

            "my youtube" => {
                println!(
                    "Check out my YouTube channel: \
                     https://www.youtube.com/@JUNGLESCRIPT ▶"
                );
                continue;
            }

            _ => {}
        }

        // Change the working directory persistently.
        // This makes "cd" work across multiple commands.
        if is_cd_command(command) {
            match change_directory(command, &mut current_dir) {
                Ok(()) => {}
                Err(error) => eprintln!("Directory error: {}", error),
            }
            continue;
        }

        // All other commands are executed by real Windows PowerShell.
        run_powershell(command, &current_dir);
    }
}

fn show_help() {
    println!();
    println!("🌴 JungleScript Terminal Commands");
    println!("---------------------------------");
    println!("  help             Show this help");
    println!("  version          Show JungleScript version");
    println!("  clear / cls      Clear the screen");
    println!("  exit / quit      Exit the terminal");
    println!("  owner            Show project owner");
    println!("  my youtube       Show YouTube channel");
    println!("  cd <path>        Change directory");
    println!();
    println!("PowerShell commands are also supported:");
    println!("  Get-Location     Show current directory");
    println!("  Get-ChildItem    List files and folders");
    println!("  Get-Process      List running processes");
    println!("  Get-Date         Show date and time");
    println!("  ipconfig         Show network information");
    println!();
    println!("Any other command is passed to PowerShell.");
    println!();
}

fn is_cd_command(command: &str) -> bool {
    let trimmed = command.trim_start();
    let lower = trimmed.to_lowercase();

    lower == "cd"
        || lower.starts_with("cd ")
        || lower == "chdir"
        || lower.starts_with("chdir ")
        || lower == "set-location"
        || lower.starts_with("set-location ")
        || lower == "sl"
        || lower.starts_with("sl ")
}

fn change_directory(
    command: &str,
    current_dir: &mut PathBuf,
) -> io::Result<()> {
    let trimmed = command.trim();
    let lower = trimmed.to_lowercase();

    let argument = if lower == "cd" || lower == "chdir"
        || lower == "set-location" || lower == "sl"
    {
        ""
    } else if lower.starts_with("set-location ") {
        trimmed["set-location".len()..].trim()
    } else if lower.starts_with("chdir ") {
        trimmed["chdir".len()..].trim()
    } else if lower.starts_with("cd ") {
        trimmed[2..].trim()
    } else {
        trimmed[2..].trim()
    };

    if argument.is_empty() {
        println!("{}", current_dir.display());
        return Ok(());
    }

    // Allow paths containing spaces, including quoted paths.
    let path_text = argument
        .trim()
        .trim_matches('"')
        .trim_matches('\'');

    let requested_path = PathBuf::from(path_text);

    let destination = if requested_path.is_absolute() {
        requested_path
    } else {
        current_dir.join(requested_path)
    };

    if !destination.is_dir() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            format!("Directory not found: {}", destination.display()),
        ));
    }

    let destination = destination.canonicalize()?;

    *current_dir = destination;

    println!("{}", current_dir.display());
    Ok(())
}

fn run_powershell(command: &str, current_dir: &PathBuf) {
    // This executes the user's command in Windows PowerShell.
    // PowerShell syntax and commands are supported here.
    let result = Command::new("powershell.exe")
        .arg("-NoLogo")
        .arg("-NoProfile")
        .arg("-Command")
        .arg(command)
        .current_dir(current_dir)
        .status();

    match result {
        Ok(status) => {
            if !status.success() {
                show_exit_status(status);
            }
        }

        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            eprintln!("PowerShell was not found.");
            eprintln!(
                "Check that Windows PowerShell is installed \
                 and available as powershell.exe."
            );
        }

        Err(error) => {
            eprintln!("Could not run PowerShell: {}", error);
        }
    }
}

fn show_exit_status(status: ExitStatus) {
    if let Some(code) = status.code() {
        eprintln!("PowerShell command exited with code {}.", code);
    }
}
