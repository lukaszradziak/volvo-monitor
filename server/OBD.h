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
    bool canMonitorActive = false;
    int canMonitorAddress;
    
  public:
    void begin(gpio_num_t canTx, gpio_num_t canRx, gpio_num_t klineTx);

    void canOpen(int speed);
    void canClose();
    void canWrite(uint32_t id, byte byte0, byte byte1, byte byte2, byte byte3, byte byte4, byte byte5, byte byte6, byte byte7);
    
    String canTest(int canSpeed, int canHex, int parameter);

    void canMonitorStart(int canSpeed, int canAddress, int canInterval, int parameters[], int parametersSize);
    void canMonitorStop();
    String canMonitorData();

    void klineWrite();
};

#endif