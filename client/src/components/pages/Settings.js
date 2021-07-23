import React from "react";

import { Formik } from "formik";
import Input from "components/elements/Input";
import Select from "components/elements/Select";
import Button from "components/elements/Button";
import DefaultTheme from "components/templates/DefaultTheme";

const intervalTimes = [1000, 500, 200, 100, 50];

const Settings = () => {
  return (
    <DefaultTheme title="Settings">
      <Formik
        initialValues={{
          backendUrl: "localhost",
          refreshInterval: intervalTimes[0],
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Backend URL</label>
              <Input
                type="text"
                name="backendUrl"
                placeholder="Backend URL"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.backendUrl}
              />
              {errors.backendUrl && touched.backendUrl && errors.backendUrl}
            </div>
            <div>
              <label>Refresh Interval</label>
              <Select
                name="refreshInterval"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.refreshInterval}
              >
                {intervalTimes.map((time, key) => (
                  <option key={key} value={time}>
                    {time} ms
                  </option>
                ))}
              </Select>
              {errors.refreshInterval &&
                touched.refreshInterval &&
                errors.refreshInterval}
            </div>
            <Button type="submit">Save</Button>
          </form>
        )}
      </Formik>
    </DefaultTheme>
  );
};

export default Settings;
