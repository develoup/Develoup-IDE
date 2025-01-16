## Installation Process
### Language Server
#### Arduino CLI Setup
- ./resources/bin/arduino-cli.exe --config-file ./resources/config/arduino-cli.yaml core update-index

#### Arduino Boards
- ./resources/bin/arduino-cli.exe --config-file ./resources/config/arduino-cli.yaml core install arduino:avr

#### Arduino ESP Boards
- ./resources/bin/arduino-cli.exe --config-file ./resources/config/arduino-cli.yaml core install esp32:esp32



!!!!! TO SUPPORT ALL CHIPS PROVIDE THIS LINK: https://espressif.github.io/arduino-esp32/package_esp32_index.json !!!!!
!!!!!  When spawning the Language Server a specific board must be selected. In the future do this based on the selected board and restart the Langage server. this can be changed in the electron LSP setup process under args '--fqbn=arduino:avr:uno' !!!!!


Monitor: arduino-cli monitor -p /dev/tty.usbserial-0001 -c baudrate=115200
