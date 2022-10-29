import * as yup from "yup";
import { useState } from "react";
import { Formik } from "formik";
import { useMutation } from '@apollo/client';
import { CREATE_EVENT } from "hooks/mutations";
import { useRouter } from "next/router";

export default function Create() {
  const [alert, setAlert] = useState()
  const router = useRouter();

  const validationSchema = yup.object({
    title: yup
      .string()
      .nullable()
      .required("عنوان مطلوب"),
    description: yup
      .string()
      .nullable()
      .required("الوصف مطلوب"),
    price: yup
      .string()
      .nullable()
      .required("السعر مطلوب"),
    date: yup
      .string()
      .nullable()
      .required("تاريخ مطلوب"),
  });

  const [eventConfirmHandler, { error }] = useMutation(CREATE_EVENT, {
    onError: (error) => {
      setAlert(error.message)
    },
    onCompleted: () => {
      setAlert("تم إضافة المناسبة بنجاح")
      router.push("/events");
    }
  })

  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1>{alert}</h1>
      <Formik
        initialValues={{
          title: null,
          description: null,
          price: null,
          date: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          eventConfirmHandler(
            { variables: { 
                title: values.title, 
                price: +values.price, 
                date: values.date, 
                description: values.description 
              }
            }
          )
          resetForm({ values: "" });
        }}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            { 
              <div>
                {formikProps.touched.title && formikProps.errors.title ? (
                  <li>{formikProps.errors.title}</li>
                ) : null}
                {formikProps.touched.description &&
                formikProps.errors.description ? (
                  <li>{formikProps.errors.description}</li>
                ) : null}
                {formikProps.touched.price && formikProps.errors.price ? (
                  <li>{formikProps.errors.price}</li>
                ) : null}
                {formikProps.touched.date && formikProps.errors.date ? (
                  <li>{formikProps.errors.date}</li>
                ) : null}
              </div>
            }
            <input
              type="text"
              name="title"
              placeholder="title"
              value={
                formikProps.values.title != null ? formikProps.values.title : ""
              }
              onChange={formikProps.handleChange}
            />
            <input
              type="text"
              name="description"
              placeholder="description"
              value={
                formikProps.values.description != null
                  ? formikProps.values.description
                  : ""
              }
              onChange={formikProps.handleChange}
            />
            <input
              type="price"
              name="price"
              placeholder="price"
              value={
                formikProps.values.price != null ? formikProps.values.price : ""
              }
              onChange={formikProps.handleChange}
            />
            <input
              type="date"
              name="date"
              placeholder="date"
              value={
                formikProps.values.date != null ? formikProps.values.date : ""
              }
              onChange={formikProps.handleChange}
            />
            <button type="submit">is Okey</button>
          </form>
        )}
      </Formik>
    </div>
  );
}
