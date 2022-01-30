#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "SPIFFS.h"

#define WIFI_SSID "VolvoMonitor"
#define WIFI_PASS "12345678"

AsyncWebServer server(80);
String monitorData = "";

void task0(void* param){
  while(true){
    if(monitorData.length() > 10000){
      monitorData = "";
    }
    monitorData += millis();
    monitorData += ";";
    monitorData += "test";
    monitorData += "\n";

    vTaskDelay(100UL);
  }
}

void setup() {
  Serial.begin(115220);
  printf("Hello Volvo Monitor!\n");

  SPIFFS.begin(true);
  WiFi.setSleep(false);
  WiFi.mode(WIFI_STA);
  WiFi.softAP(WIFI_SSID, WIFI_PASS);

  IPAddress IP = WiFi.softAPIP();
  printf("Address ip: %s\n", IP.toString().c_str());

  server.on("/api/monitor-data", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", monitorData);
    monitorData = "";
  });

  server
    .serveStatic("/", SPIFFS, "/")
    .setDefaultFile("index.html")
    .setCacheControl("max-age=600");

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  server.begin();

  xTaskCreatePinnedToCore(task0, "Task0", 4096, NULL, 1, NULL, 0);
}

void loop() {

}