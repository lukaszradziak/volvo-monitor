#include <Arduino.h>

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "SPIFFS.h"

AsyncWebServer server(80);

void setup() {
  Serial.begin(115220);
  printf("Hello Volvo Monitor!\n");

  if(!SPIFFS.begin(true)){
    printf("An Error has occurred while mounting SPIFFS\n");
		return;
	}

  WiFi.mode(WIFI_STA);
  WiFi.softAP("VolvoMonitor", "12345678");

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });

  server.on("/favicon.ico", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/favicon.ico", "image/x-icon");
  });

  server.on("/index.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.css", "text/css");
  });

  server.on("/index.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.js", "text/javascript");
  });

  server.on("/vendor.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/vendor.js", "text/javascript");
  });

  server.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
}