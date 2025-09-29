import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

const CreatePlaylist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onNewPlaylist = location.state?.onNewPlaylist; // callback from Playlists page

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Playlist name must be at least 3 characters")
      .max(50, "Playlist name cannot exceed 50 characters")
      .required("Playlist name is required"),
    description: Yup.string().max(200, "Description cannot exceed 200 characters"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (!user) {
      setFieldError("name", "You must be logged in to create a playlist.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/playlists", {
        name: values.name.trim(),
        description: values.description.trim(),
        user_id: user.id,
      });

      // Call the callback to update the Playlists list
      if (onNewPlaylist) onNewPlaylist(res.data);

      // Navigate to the new playlist detail page
      navigate(`/playlists/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setFieldError(
        "name",
        err.response?.data?.error || "Failed to create playlist. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Create New Playlist</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form-container">
            <label htmlFor="name">Name:</label>
            <Field type="text" name="name" placeholder="Enter playlist name" />
            <ErrorMessage name="name" component="p" className="error" />

            <label htmlFor="description">Description:</label>
            <Field as="textarea" name="description" placeholder="Optional description" />
            <ErrorMessage name="description" component="p" className="error" />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePlaylist;
