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

#define MAX_PARAMETERS 20

AsyncWebServer server(80);
OBD obd;

String monitorData = "";

void task0(void* param){
  while(true){
    obd.klineWrite();
    if(obd.canAvailable()){
      obd.canDiag();
    }
    vTaskDelay(2000UL);
  }
}

void task1(void* param){
  while(true){
    if(obd.canAvailable()){
      monitorData += obd.canData();
    } 
    vTaskDelay(1UL);
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

  server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", monitorData);
    monitorData = "";
  });

  server.on("/api/sniffer/start", HTTP_POST, [](AsyncWebServerRequest *request){
    int canSpeed = request->arg("canSpeed").toInt();
    printf("Sniffer start: speed: %i\n", canSpeed);

    int filters[8];
    int filterIndex = 0;

    int params = request->params();
    for(int i = 0; i < params; i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isPost() && p->name().indexOf("filter") != -1){
        filters[filterIndex] = p->value().toInt();
        printf("filter: %02X\n", filters[filterIndex]);
        filterIndex++;
      }
    }

    obd.canSnifferStart(canSpeed, filters);

    request->send(200, "text/plain", "ok");
  });

  server.on("/api/sniffer/stop", HTTP_POST, [](AsyncWebServerRequest *request){
    printf("Sniffer stop\n");
    obd.canSnifferStop();

    request->send(200, "text/plain", "ok");
  });

  server.on("/api/sniffer/message", HTTP_POST, [](AsyncWebServerRequest *request){
    int address = request->arg("address").toInt();
    printf("Sniffer messsage: address: %i\n", address);

    int message[8];
    int messageIndex = 0;

    int params = request->params();
    for(int i = 0; i < params; i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isPost() && p->name().indexOf("data") != -1){
        message[messageIndex] = p->value().toInt();
        printf("message: %02X\n", message[messageIndex]);
        messageIndex++;
      }
    }

    obd.canDiag();
    obd.canWrite(address, message[0], message[1], message[2], message[3], message[4], message[5], message[6], message[7]);
    delay(30UL);

    request->send(200, "text/plain", "ok");
  });

  server.on("/api/monitor/start", HTTP_POST, [](AsyncWebServerRequest *request){
    int canSpeed = request->arg("canSpeed").toInt();
    int canAddress = request->arg("canAddress").toInt();
    int canInterval = request->arg("canInterval").toInt();

    printf("Monitor start: speed: %i, address: %02X, interval: %02X\n", canSpeed, canAddress, canInterval);

    int parameters[MAX_PARAMETERS];
    int parametersSize = 0;

    int params = request->params();
    for(int i = 0; i < params; i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isPost() && p->name().indexOf("param") != -1){
        parameters[parametersSize] = p->value().toInt();
        printf("param: %02X\n", parameters[parametersSize]);
        parametersSize++;
      }
    }

    obd.canMonitorStart(canSpeed, canAddress, canInterval, parameters, parametersSize);

    request->send(200, "text/plain", "ok");
  });


  server.on("/api/monitor/stop", HTTP_POST, [](AsyncWebServerRequest *request){
    printf("Monitor stop\n");
    obd.canMonitorStop();

    request->send(200, "text/plain", "ok");
  });

  server.on("/api/monitor/test", HTTP_POST, [](AsyncWebServerRequest *request){
    int canSpeed = request->arg("canSpeed").toInt();
    int canAddress = request->arg("canAddress").toInt();
    int parameter = request->arg("address").toInt();

    printf("Monitor test: speed: %i, address: %02X, parameter: %04X\n", canSpeed, canAddress, parameter);
    String canResponse = obd.canTest(canSpeed, canAddress, parameter);

    request->send(200, "text/plain", canResponse);
  });

  server.on("/api/dtc/read", HTTP_POST, [](AsyncWebServerRequest *request){
    int canSpeed = request->arg("canSpeed").toInt();
    int canAddress = request->arg("canAddress").toInt();

    printf("DTC read: speed: %i, address: %02X\n", canSpeed, canAddress);
    String data = obd.canDtcRead(canSpeed, canAddress);

    request->send(200, "text/plain", data);
  });

  server.on("/api/dtc/clear", HTTP_POST, [](AsyncWebServerRequest *request){
    int canSpeed = request->arg("canSpeed").toInt();
    int canAddress = request->arg("canAddress").toInt();

    printf("DTC clear: speed: %i, address: %02X\n", canSpeed, canAddress);
    obd.canDtcClear(canSpeed, canAddress);

    request->send(200, "text/plain", "ok");
  });


  server
    .serveStatic("/", SPIFFS, "/")
    .setDefaultFile("index.html")
    .setCacheControl("max-age=600");

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  server.begin();

  xTaskCreatePinnedToCore(task0, "Task0", 4096, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(task1, "Task1", 4096, NULL, 1, NULL, 1);
}

void loop() {}