import React from "react";

import { Formik } from "formik";

const Settings = () => {
  return (
    <>
      <h1>Settings</h1>
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
              <input
                type="text"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && errors.email}
            </div>
            <div>
              <input
                type="text"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Settings;
