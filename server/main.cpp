#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "SPIFFS.h"

#define WIFI_SSID "VolvoMonitor"
#define WIFI_PASS "12345678"

AsyncWebServer server(80);

void setup() {
  Serial.begin(115220);
  printf("Hello Volvo Monitor!\n");

  SPIFFS.begin(true);
  WiFi.mode(WIFI_STA);
  WiFi.softAP(WIFI_SSID, WIFI_PASS);

  IPAddress IP = WiFi.softAPIP();
  printf("Address ip: %s\n", IP.toString().c_str());

  server
    .serveStatic("/", SPIFFS, "/")
    .setDefaultFile("index.html")
    .setCacheControl("max-age=600");

  server.begin();
}

void loop() {

}