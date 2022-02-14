# Volvo Monitor 🏎

Tool for logging Volvo parameters (MY2000-2009). Engine speed, boost, AFR etc.

Frontend: `React (Vite.js)`

Backend: `ESP32 Web Server (Arduino)` 

## How to build on ESP32

1. Download last release
2. Open project in Visual Studio Code
3. Click tab "PlatformIO"
4. "Platform" -> "Upload Filesystem Image"
5. "General" -> "Upload & Monitor"
6. Connect to WIFI "VolvoMonitor" (password: 12345678)
7. Open in browser url: 192.168.4.1

## Dev
1. `npm i`
2. `npm run dev`

## Schematic
K-line is not required for MY05+

![Schematic_Volvo Monitor_2022-02-12 (1)](https://user-images.githubusercontent.com/1611323/153964459-e9d2eece-6554-4847-b644-888bdb9f712f.png)

## Preview

<img src="https://user-images.githubusercontent.com/1611323/153965306-7a09cf9a-c20f-490b-9c80-7fc794b97af6.png" width="250"> <img src="https://user-images.githubusercontent.com/1611323/153965314-8ca268a8-b0d7-4fe2-9d6e-02418a195b8f.png" width="250">
<img src="https://user-images.githubusercontent.com/1611323/153965320-ae1f018a-8bbc-476f-941d-b3ccea25e641.png" width="250"> <img src="https://user-images.githubusercontent.com/1611323/153965330-17e55f13-17aa-4316-b6a6-de64e79e4bc5.png" width="250">
<img src="https://user-images.githubusercontent.com/1611323/153965297-3b067009-1b0f-48a7-9117-82291f7b9d5b.png" width="250"> 
