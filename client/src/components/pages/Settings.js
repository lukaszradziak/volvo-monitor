import React from "react";

import { Formik } from "formik";
import Input from "components/elements/Input";
import Button from "components/elements/Button";
import DefaultTheme from "components/templates/DefaultTheme";

const Settings = () => {
  return (
    <DefaultTheme title="Settings">
      <Formik
        initialValues={{ email: "", password: "" }}
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
              <Input
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
            </div>
            <div>
              <Input
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        )}
      </Formik>
    </DefaultTheme>
  );
};

export default Settings;
