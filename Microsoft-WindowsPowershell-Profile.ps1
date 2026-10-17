# Fix character encoding for UTF-8 symbols
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Enable Virtual Terminal Processing (ANSI Escape Colors) globally
Set-ItemProperty -Path "HKCU:\Console" -Name "VirtualTerminalLevel" -Value 1 -ErrorAction SilentlyContinue
