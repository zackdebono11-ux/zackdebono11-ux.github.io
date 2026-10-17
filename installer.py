import os
import sys
import shutil
import subprocess
import winreg
from pathlib import Path

APP_NAME = "JungleScript 0.2.1"

def get_base_dir():
    """Directory the installer itself lives in, whether run as a plain
    .py script or as a PyInstaller --onefile frozen exe (where __file__
    would otherwise point into a temporary extraction folder)."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent
    return Path(__file__).parent


BASE_DIR = get_base_dir()

INSTALL_DIR = Path(os.environ["LOCALAPPDATA"]) / APP_NAME

EXE_NAME = "JungleScript Setup 0.2.0.exe"
EXE_PATH = INSTALL_DIR / EXE_NAME


def add_to_path():
    """Add JungleScript's installation directory to the user's PATH."""

    key_path = r"Environment"

    with winreg.OpenKey(
        winreg.HKEY_CURRENT_USER,
        key_path,
        0,
        winreg.KEY_READ | winreg.KEY_WRITE
    ) as key:

        try:
            current_path, value_type = winreg.QueryValueEx(key, "Path")
        except FileNotFoundError:
            current_path = ""
            value_type = winreg.REG_EXPAND_SZ

        paths = [p.strip() for p in current_path.split(";") if p.strip()]

        install_string = str(INSTALL_DIR)

        if install_string not in paths:
            paths.append(install_string)

            new_path = ";".join(paths)

            winreg.SetValueEx(
                key,
                "Path",
                0,
                value_type,
                new_path
            )

    # Tell Windows that environment variables changed.
    subprocess.run(
        [
            "powershell",
            "-NoProfile",
            "-Command",
            "[Environment]::SetEnvironmentVariable('Path', "
            "[Environment]::GetEnvironmentVariable('Path', 'User'), "
            "'User')"
        ],
        capture_output=True
    )


def register_jls_files():
    """Associate .jls files with JungleScript."""

    file_class = "JungleScript.File"

    # .jls -> JungleScript.File
    with winreg.CreateKey(
        winreg.HKEY_CURRENT_USER,
        r"Software\Classes\.jls"
    ) as key:
        winreg.SetValueEx(
            key,
            "",
            0,
            winreg.REG_SZ,
            file_class
        )

    # JungleScript.File information
    with winreg.CreateKey(
        winreg.HKEY_CURRENT_USER,
        rf"Software\Classes\{file_class}"
    ) as key:
        winreg.SetValueEx(
            key,
            "",
            0,
            winreg.REG_SZ,
            "JungleScript Source File"
        )

    # Icon
    with winreg.CreateKey(
        winreg.HKEY_CURRENT_USER,
        rf"Software\Classes\{file_class}\DefaultIcon"
    ) as key:
        winreg.SetValueEx(
            key,
            "",
            0,
            winreg.REG_SZ,
            str(EXE_PATH)
        )

    # Open command
    command = f'"{EXE_PATH}" "%1"'

    with winreg.CreateKey(
        winreg.HKEY_CURRENT_USER,
        rf"Software\Classes\{file_class}\shell\open\command"
    ) as key:
        winreg.SetValueEx(
            key,
            "",
            0,
            winreg.REG_SZ,
            command
        )


def create_start_menu_shortcut():
    """Create a Start Menu shortcut."""

    start_menu = (
        Path(os.environ["APPDATA"])
        / "Microsoft"
        / "Windows"
        / "Start Menu"
        / "Programs"
    )

    shortcut = start_menu / "JungleScript1.lnk"

    powershell_script = f'''
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("{shortcut}")
$Shortcut.TargetPath = "{EXE_PATH}"
$Shortcut.WorkingDirectory = "{INSTALL_DIR}"
$Shortcut.Description = "JungleScript Programming Language"
$Shortcut.Save()
'''

    subprocess.run(
        [
            "powershell",
            "-NoProfile",
            "-Command",
            powershell_script
        ],
        check=False
    )


def install():
    print()
    print("===================================")
    print("       🌴 JungleScript Installer")
    print("===================================")
    print()

    source_exe = BASE_DIR / EXE_NAME

    if not source_exe.exists():
        print(f"ERROR: {EXE_NAME} was not found or was already installed.")
        print(f"       Expected it next to installer.py at:")
        print(f"       {source_exe}")
        print()
        input("Press Enter to exit...")
        return

    print("Installing JungleScript...")
    print()

    # Create installation directory
    INSTALL_DIR.mkdir(parents=True, exist_ok=True)

    # Copy engine
    print("[1/4] Installing JungleScript engine...")
    shutil.copy2(source_exe, EXE_PATH)

    # PATH
    print("[2/4] Adding JungleScript to PATH...")
    add_to_path()

    # .jls association
    print("[3/4] Registering .jls files...")
    register_jls_files()

    # Start Menu
    print("[4/4] Creating Start Menu shortcut...")
    create_start_menu_shortcut()

    print()
    print("===================================")
    print("       Installation complete!")
    print("===================================")
    print()
    print("JungleScript installed to:")
    print(INSTALL_DIR)
    print()
    print("You can now run:")
    print()
    print("    junglescript myfile.jls")
    print()
    print("You can also double-click .jls files.")
    print()
    print("NOTE: Open a new Command Prompt or")
    print("PowerShell window before using")
    print("the 'junglescript' command.")
    print()

    input("Press Enter to finish...")


if __name__ == "__main__":
    try:
        install()
    except Exception:
        import traceback
        print()
        print("===================================")
        print("       Installation FAILED")
        print("===================================")
        print()
        traceback.print_exc()
        print()
        input("Press Enter to exit...")
