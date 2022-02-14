#ifndef OBD_h
#define OBD_h

#include <Arduino.h>
#include <ESP32CAN.h>
#include <CAN_config.h>

class OBD {
  private:
    gpio_num_t canTx;
    gpio_num_t canRx;
    gpio_num_t klineTx;

    bool canSnifferActive = false;
    bool canMonitorActive = false;

    int canMonitorAddress = -1;
    int canMonitorData = -1;
    
  public:
    void begin(gpio_num_t canTx, gpio_num_t canRx, gpio_num_t klineTx);

    void canOpen(int speed);
    void canClose();
    void canWrite(uint32_t id, byte byte0, byte byte1, byte byte2, byte byte3, byte byte4, byte byte5, byte byte6, byte byte7);
    
    void canDiag();
    
    String canTest(int canSpeed, int canHex, int parameter);

    void canSnifferStart(int canSpeed, int filter[8]);
    void canSnifferStop();

    void canMonitorStart(int canSpeed, int canAddress, int canInterval, int parameters[], int parametersSize);
    void canMonitorStop();

    String canDtcRead(int canSpeed, int canAddress);
    void canDtcClear(int canSpeed, int canAddress);

    String canData();
    bool canAvailable();

    void klineWrite();
};

#endif