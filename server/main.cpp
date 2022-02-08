#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "SPIFFS.h"
#include "OBD.h"

#define WIFI_SSID "VolvoMonitor"
#define WIFI_PASS "12345678"

#define OBD_CAN_RX GPIO_NUM_4
#define OBD_CAN_TX GPIO_NUM_5
#define OBD_KLINE_TX GPIO_NUM_12

#define MAX_PARAMETERS 10

CAN_device_t CAN_cfg;
AsyncWebServer server(80);
OBD obd;

String monitorData = "";

void task0(void* param){
  while(true){
    obd.klineWrite();
    vTaskDelay(2000UL);
  }
}

void setup() {
  Serial.begin(115220);
  printf("Hello Volvo Monitor!\n");

  obd.begin(OBD_CAN_RX, OBD_CAN_TX, OBD_KLINE_TX);

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

  server.on("/api/monitor/run", HTTP_POST, [](AsyncWebServerRequest *request){
    String canSpeed = request->arg("canSpeed");
    String canAddress = request->arg("canAddress");
    String canInterval = request->arg("canInterval");

    printf("Monitor run: %s - %s - %s\n", canSpeed, canAddress, canInterval);

    int canAddressHex = strtoul(canAddress.c_str(), NULL, 16);
    int canIntervalHex = strtoul(canInterval.c_str(), NULL, 16);

    int parameters[MAX_PARAMETERS][2];
    for(int i=0; i < MAX_PARAMETERS; i++){
      parameters[i][0] = 0;
      parameters[i][1] = 0;
    }

    int params = request->params();
    int index = 0;
    for(int i = 0; i < params; i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isPost()){
        int hex = strtoul(p->value().c_str(), NULL, 16);
        parameters[index][0] = hex >> 8 & 0xFF;
        parameters[index][1] = hex & 0xFF;
        index++;
        printf("[%s]: %s\n", p->name().c_str(), p->value().c_str());
      }
    }

    obd.canOpen(canSpeed);
    String canResponse = obd.canMonitor(canAddressHex, canIntervalHex, parameters);

    request->send(200, "text/plain", canResponse);
  });

  server.on("/api/monitor/test", HTTP_POST, [](AsyncWebServerRequest *request){
    String canSpeed = request->arg("canSpeed");
    String canAddress = request->arg("canAddress");
    String address = request->arg("address");

    printf("Monitor test: %s - %s - %s\n", canSpeed, canAddress, address);

    int canHex = strtoul(canAddress.c_str(), NULL, 16);
    int parameter = strtoul(address.c_str(), NULL, 16);
    int parameter1 = parameter >> 8 & 0xFF;
    int parameter2 = parameter & 0xFF;
    
    obd.canOpen(canSpeed);
    String canResponse = obd.canTest(canHex, parameter1, parameter2);

    request->send(200, "text/plain", canResponse);
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